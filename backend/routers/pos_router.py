# Capa de Controlador: Rutas aisladas físicamente para el Punto de Venta
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..services.pos_service import PosService

# Prefijo completamente aislado de las rutas de administrador
router = APIRouter(
    prefix="/api/pos",
    tags=["Punto de Venta"]
)

# Mock de inyección de dependencias para simular la DB (reemplazar con DB real)
async def get_db_connection():
    class MockDB:
        async def execute(self, query): pass
        async def fetch(self, query): return [{"id": 1, "nombre": "Producto Prueba", "stock_disponible": 10, "precio_venta": 99.99}]
        def transaction(self):
            class Tx:
                async def __aenter__(self): pass
                async def __aexit__(self, *args): pass
            return Tx()
    return MockDB()

@router.get("/productos")
async def listar_productos(db = Depends(get_db_connection)):
    """
    Endpoint dedicado para obtener el catálogo del POS.
    No contiene condicionales if/else para ocultar datos; la seguridad es estructural.
    """
    try:
        service = PosService(db)
        productos = await service.get_catalogo_productos()
        return {"status": "success", "data": productos}
    except Exception as e:
        # Manejo de excepciones estricto: Nunca exponer el error de la DB al cliente
        # Aquí enviaríamos el error real a un logger interno (ej. Sentry)
        raise HTTPException(status_code=500, detail="Error interno del servidor al cargar el catálogo.")
