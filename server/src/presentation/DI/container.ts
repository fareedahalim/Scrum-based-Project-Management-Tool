import { RepositoryModule } from "./RepositoryModule";
import { ServiceModule } from "./ServiceModule";
import { UseCaseModule } from "./UseCaseModule";

export class ContainerSetup {
    static registerAll(): void {
        ServiceModule.registerModule()
        RepositoryModule.registerModules()
        UseCaseModule.registerModule()
    }    
}