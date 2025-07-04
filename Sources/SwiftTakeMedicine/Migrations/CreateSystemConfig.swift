import Fluent

struct CreateSystemConfig: Migration {
    func prepare(on database: any Database) -> EventLoopFuture<Void> {
        database.schema("system_configs")
            .id()
            .field("notification_endpoint_url", .string, .required)
            .create()
    }

    func revert(on database: any Database) -> EventLoopFuture<Void> {
        database.schema("system_configs").delete()
    }
} 