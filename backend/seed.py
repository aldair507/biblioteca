import importlib
import pkgutil
import app.seeds

def run_all_seeds():
    package = app.seeds
    for _, module_name, _ in pkgutil.iter_modules(package.__path__):
        if module_name.startswith("seed_"):  # solo archivos seed_*
            module = importlib.import_module(f"app.seeds.{module_name}")
            if hasattr(module, "run"):
                print(f"▶ Ejecutando seed: {module_name}")
                module.run()

if __name__ == "__main__":
    run_all_seeds()
