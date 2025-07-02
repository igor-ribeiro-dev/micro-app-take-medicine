import Vapor
import Fluent

final class SystemConfig: Model, Content, @unchecked Sendable {
    static let schema = "system_configs"
    
    @ID(key: .id)
    var id: UUID?
    
    @Field(key: "notification_endpoint_url")
    var notificationEndpointUrl: String
    
    init() {}
    
    init(id: UUID? = nil, notificationEndpointUrl: String) {
        self.id = id
        self.notificationEndpointUrl = notificationEndpointUrl
    }
} 