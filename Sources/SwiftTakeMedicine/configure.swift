import NIOSSL
import Fluent
import FluentSQLiteDriver
import Leaf
import Vapor

// configures your application
public func configure(_ app: Application) async throws {
    // uncomment to serve files from /Public folder
    // app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))

    app.databases.use(DatabaseConfigurationFactory.sqlite(.file("db.sqlite")), as: .sqlite)

    app.migrations.add(CreateTodo())
    app.migrations.add(CreateMedication())
    app.migrations.add(CreateSystemConfig())

    app.views.use(.leaf)

    // Inicia o serviço de notificação de medicamentos
    let notificationService = MedicationNotificationService(app: app)
    notificationService.start()
    app.lifecycle.use(NotificationServiceLifecycleHandler(service: notificationService))

    // register routes
    try routes(app)
}

final class NotificationServiceLifecycleHandler: LifecycleHandler, @unchecked Sendable {
    let service: MedicationNotificationService
    init(service: MedicationNotificationService) {
        self.service = service
    }
    func shutdown(_ application: Application) {
        service.shutdown()
    }
}
