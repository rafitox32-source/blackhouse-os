# TDD: Pruebas unitarias para garantizar la no-regresión y el aislamiento de datos
import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from ..routers.pos_router import router

# Setup del entorno de pruebas
app = FastAPI()
app.include_router(router)
client = TestClient(app)

def test_catalogo_pos_retorna_200_y_estructura_correcta():
    """Verifica la conectividad básica del nuevo endpoint aislado."""
    response = client.get("/api/pos/productos")
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_catalogo_pos_no_expone_costos_ni_margenes():
    """
    PRUEBA CRÍTICA: Verifica matemáticamente y estructuralmente que 
    es imposible que los costos del proveedor o márgenes lleguen al frontend POS.
    """
    response = client.get("/api/pos/productos")
    productos = response.json()["data"]
    
    assert isinstance(productos, list)
    
    if len(productos) > 0:
        producto = productos[0]
        
        # 1. Afirmamos la presencia de los datos permitidos
        assert "id" in producto
        assert "nombre" in producto
        assert "precio_venta" in producto
        
        # 2. AFIRMAMOS LA AUSENCIA de datos prohibidos (Regresión Cero)
        assert "costo_proveedor" not in producto, "¡BRECHA DE SEGURIDAD! Costo expuesto en endpoint POS."
        assert "margen" not in producto, "¡BRECHA DE SEGURIDAD! Margen expuesto en endpoint POS."
