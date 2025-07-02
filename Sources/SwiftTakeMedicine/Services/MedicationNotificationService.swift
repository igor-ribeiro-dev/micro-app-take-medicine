import Vapor
import Fluent

final class MedicationNotificationService {
    private var timer: RepeatedTask?
    private let app: Application
    
    init(app: Application) {
        self.app = app
    }
    
    func start() {
        // Roda a cada 60 segundos
        timer = app.eventLoopGroup.next().scheduleRepeatedTask(initialDelay: .seconds(5), delay: .seconds(60)) { [weak self] _ in
            self?.checkAndNotify()
        }
    }
    
    func shutdown() {
        timer?.cancel()
    }
    
    private func checkAndNotify() {
        let db = app.db
        let now = Date()
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        let currentTime = formatter.string(from: now)
        
        // Busca o endpoint configurado primeiro
        SystemConfig.query(on: db).first().flatMap { config in
            guard let config = config else { return self.app.eventLoopGroup.next().makeSucceededFuture(()) }
            let url = config.notificationEndpointUrl
            // Busca todos os medicamentos para o horário atual
            return Medication.query(on: db)
                .filter(\.$time == currentTime)
                .all()
                .flatMap { medications in
                    guard !medications.isEmpty else { return self.app.eventLoopGroup.next().makeSucceededFuture(()) }
                    let client = self.app.client
                    let futures = medications.map { medication in
                        client.post(URI(string: url)) { req in
                            try req.content.encode(["id": medication.id?.uuidString ?? "", "name": medication.name, "dosage": medication.dosage, "time": medication.time])
                        }.map { response in
                            self.app.logger.info("Notificação enviada para medicamento \(medication.name) - status: \(response.status)")
                        }.flatMapError { error in
                            self.app.logger.error("Erro ao notificar medicamento \(medication.name): \(error.localizedDescription)")
                            return self.app.eventLoopGroup.next().makeSucceededFuture(())
                        }
                    }
                    return EventLoopFuture.andAllSucceed(futures, on: self.app.eventLoopGroup.next())
                }
        }.whenComplete { _ in }
    }
} 