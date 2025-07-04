import Vapor
import Fluent
import NIOCore

final class MedicationNotificationService: @unchecked Sendable {
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
        let calendar = Calendar.current
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        let currentTime = formatter.string(from: now)
        // Calcula o horário do ciclo anterior (1 minuto atrás)
        guard let oneMinuteAgo = calendar.date(byAdding: .minute, value: -1, to: now) else { return }
        let previousTime = formatter.string(from: oneMinuteAgo)
        app.logger.info("[Notificação] Timer rodou em \(currentTime), buscando medicamentos entre \(previousTime) e \(currentTime)")
        // Busca o endpoint configurado primeiro
        SystemConfig.query(on: db).first().flatMap { config in
            guard let config = config else { return self.app.eventLoopGroup.next().makeSucceededFuture(()) }
            let url = config.notificationEndpointUrl
            // Busca todos os medicamentos cujo horário está entre previousTime e currentTime
            return Medication.query(on: db)
                .group(.or) { group in
                    group.filter(\.$time == previousTime)
                    group.filter(\.$time == currentTime)
                }
                .all()
                .flatMap { medications in
                    guard !medications.isEmpty else {
                        self.app.logger.info("[Notificação] Nenhum medicamento encontrado para o intervalo \(previousTime) - \(currentTime)")
                        return self.app.eventLoopGroup.next().makeSucceededFuture(())
                    }
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