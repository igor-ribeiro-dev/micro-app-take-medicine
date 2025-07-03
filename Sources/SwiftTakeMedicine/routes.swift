import Fluent
import Vapor

func routes(_ app: Application) throws {
    app.get { req async throws in
        return req.fileio.streamFile(at: app.directory.publicDirectory + "index.html")
    }

    app.get("hello") { req async -> String in
        "Hello, world!"
    }

    app.get("health") { req async -> [String: String] in
        ["status": "ok"]
    }

    try app.register(collection: TodoController())
    try app.register(collection: MedicationController())
    try app.register(collection: SystemConfigController())
}
