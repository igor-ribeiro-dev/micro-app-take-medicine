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
        guard let userId = req.headers.first(name: "X-Auth-Request-User"), !userId.isEmpty else {
            throw Abort(.unauthorized, reason: "Header X-Auth-Request-User obrigatório")
        }
        var medication = try req.content.decode(Medication.self)
        medication.userId = userId
        return medication.save(on: req.db).map { medication }
    }

    func getAll(req: Request) throws -> EventLoopFuture<[Medication]> {
        guard let userId = req.headers.first(name: "X-Auth-Request-User"), !userId.isEmpty else {
            throw Abort(.unauthorized, reason: "Header X-Auth-Request-User obrigatório")
        }
        return Medication.query(on: req.db).filter(\.$userId == userId).all()
    }

    func update(req: Request) throws -> EventLoopFuture<Medication> {
        guard let userId = req.headers.first(name: "X-Auth-Request-User"), !userId.isEmpty else {
            throw Abort(.unauthorized, reason: "Header X-Auth-Request-User obrigatório")
        }
        let updated = try req.content.decode(Medication.self)
        return Medication.find(req.parameters.get("medicationID"), on: req.db)
            .unwrap(or: Abort(.notFound))
            .flatMap { medication in
                guard medication.userId == userId else {
                    return req.eventLoop.makeFailedFuture(Abort(.forbidden, reason: "Você só pode alterar seus próprios medicamentos"))
                }
                medication.name = updated.name
                medication.dosage = updated.dosage
                medication.time = updated.time
                return medication.save(on: req.db).map { medication }
            }
    }

    func delete(req: Request) throws -> EventLoopFuture<HTTPStatus> {
        guard let userId = req.headers.first(name: "X-Auth-Request-User"), !userId.isEmpty else {
            throw Abort(.unauthorized, reason: "Header X-Auth-Request-User obrigatório")
        }
        return Medication.find(req.parameters.get("medicationID"), on: req.db)
            .unwrap(or: Abort(.notFound))
            .flatMap { medication in
                guard medication.userId == userId else {
                    return req.eventLoop.makeFailedFuture(Abort(.forbidden, reason: "Você só pode deletar seus próprios medicamentos"))
                }
                return medication.delete(on: req.db).transform(to: .noContent)
            }
    }
} 