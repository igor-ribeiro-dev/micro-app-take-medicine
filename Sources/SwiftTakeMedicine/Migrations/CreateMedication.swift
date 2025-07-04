import Fluent

struct CreateMedication: Migration {
    func prepare(on database: any Database) -> EventLoopFuture<Void> {
        database.schema("medications")
            .id()
            .field("name", .string, .required)
            .field("dosage", .string, .required)
            .field("time", .string, .required)
            .field("user_id", .string, .required)
            .field("created_at", .datetime)
            .field("updated_at", .datetime)
            .create()
    }

    func revert(on database: any Database) -> EventLoopFuture<Void> {
        database.schema("medications").delete()
    }
} 