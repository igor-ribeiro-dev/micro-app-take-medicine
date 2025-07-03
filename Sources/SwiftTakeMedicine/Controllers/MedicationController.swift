import Vapor
import Fluent

struct MedicationController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let medications = routes.grouped("medications")
        medications.post(use: create)
        medications.get(use: getAll)
        medications.put(":medicationID", use: update)
        medications.delete(":medicationID", use: delete)
    }

    func create(req: Request) throws -> EventLoopFuture<Medication> {
        let medication = try req.content.decode(Medication.self)
        return medication.save(on: req.db).map { medication }
    }

    func getAll(req: Request) throws -> EventLoopFuture<[Medication]> {
        Medication.query(on: req.db).all()
    }

    func update(req: Request) throws -> EventLoopFuture<Medication> {
        let updated = try req.content.decode(Medication.self)
        return Medication.find(req.parameters.get("medicationID"), on: req.db)
            .unwrap(or: Abort(.notFound))
            .flatMap { medication in
                medication.name = updated.name
                medication.dosage = updated.dosage
                medication.time = updated.time
                return medication.save(on: req.db).map { medication }
            }
    }

    func delete(req: Request) throws -> EventLoopFuture<HTTPStatus> {
        Medication.find(req.parameters.get("medicationID"), on: req.db)
            .unwrap(or: Abort(.notFound))
            .flatMap { $0.delete(on: req.db) }
            .transform(to: .noContent)
    }
} 