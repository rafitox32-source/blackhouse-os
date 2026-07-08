# Capa de Servicio: Lógica de negocio y acceso a datos aislado para el módulo POS
from typing import List, Dict, Any

class PosService:
    def __init__(self, db_connection):
        self.db = db_connection

    async def get_catalogo_productos(self) -> List[Dict[str, Any]]:
        """
        Obtiene los productos usando estrictamente la vista segura de la base de datos.
        """
        # Garantizamos que la operación sea transaccional
        async with self.db.transaction():
            # 1. DEFENSA EN PROFUNDIDAD: Asumimos el rol de vendedor a nivel de sesión.
            # Aunque usemos la vista, si alguien cambia la vista por error, 
            # el RLS de la tabla base bloqueará al rol vendedor.
            await self.db.execute("SET LOCAL ROLE pos_vendedor;")
            
            # 2. Consultamos ÚNICAMENTE la capa de enmascaramiento (vista)
            query = """
                SELECT id, nombre, stock_disponible, precio_venta 
                FROM vw_productos_pos 
                WHERE stock_disponible > 0;
            """
            registros = await self.db.fetch(query)
            
            return [dict(r) for r in registros]
