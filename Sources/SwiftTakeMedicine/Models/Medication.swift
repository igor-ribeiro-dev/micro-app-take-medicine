import Vapor
import Fluent

final class Medication: Model, Content, @unchecked Sendable {
    static let schema = "medications"
    
    @ID(key: .id)
    var id: UUID?
    
    @Field(key: "name")
    var name: String
    
    @Field(key: "dosage")
    var dosage: String
    
    @Field(key: "time")
    var time: String // Pode ser ajustado para array ou outro tipo depois
    
    @Timestamp(key: "created_at", on: .create)
    var createdAt: Date?
    
    @Timestamp(key: "updated_at", on: .update)
    var updatedAt: Date?
    
    init() {}
    
    init(id: UUID? = nil, name: String, dosage: String, time: String) {
        self.id = id
        self.name = name
        self.dosage = dosage
        self.time = time
    }
} 