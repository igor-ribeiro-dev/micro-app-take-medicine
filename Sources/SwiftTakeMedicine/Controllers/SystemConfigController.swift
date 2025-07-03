import Vapor
import Fluent

struct SystemConfigController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let config = routes.grouped("config")
        config.get(use: getConfig)
        config.put(use: updateConfig)
    }

    func getConfig(req: Request) throws -> EventLoopFuture<SystemConfig> {
        SystemConfig.query(on: req.db).first().unwrap(or: Abort(.notFound))
    }

    func updateConfig(req: Request) throws -> EventLoopFuture<SystemConfig> {
        let input = try req.content.decode(SystemConfig.self)
        return SystemConfig.query(on: req.db).first().flatMap { existing in
            if let config = existing {
                config.notificationEndpointUrl = input.notificationEndpointUrl
                return config.save(on: req.db).map { config }
            } else {
                let config = SystemConfig(notificationEndpointUrl: input.notificationEndpointUrl)
                return config.save(on: req.db).map { config }
            }
        }
    }
} 