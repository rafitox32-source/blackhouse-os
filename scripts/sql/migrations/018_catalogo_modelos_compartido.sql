-- Migración 018: catálogo de modelos compartido entre todos los talleres
-- Motor: PostgreSQL (Supabase, proyecto flfhpffslhjcuvhxsnjz)
--
-- POR QUÉ:
--   Hasta ahora cada taller solo podía elegir modelos de los que ya tenía repuesto, así que
--   una empresa recién creada abría el selector y no veía nada. Este catálogo es global: toda
--   empresa arranca viendo los modelos verificados (con stock 0 si no tiene la pieza) y el
--   catálogo crece cuando un taller propone uno nuevo.
--
--   Para que no se ensucie, un modelo propuesto NO entra directo: nace 'pendiente', lo ve solo
--   quien lo propuso, y pasa a 'verificado' cuando lo aprueban desde la cola de revisión.
--   Ver docs/ESTRATEGIA_CATALOGO_MODELOS.md.
--
-- NOTA: la app de escritorio se conecta con la service key, así que estas tablas no dependen
-- de políticas RLS para funcionar; el aislamiento entre empresas lo hace la columna
-- creado_por + el estado, no la fila.

CREATE TABLE IF NOT EXISTS public.modelos_dispositivos (
    id          bigserial PRIMARY KEY,
    marca       text NOT NULL,
    -- Nombre que se muestra: "Galaxy A31". Es el más completo de los que llegaron.
    modelo      text NOT NULL,
    -- Clave canónica: "A31". Une "A31" con "Galaxy A31" para no tener el equipo dos veces.
    -- La calcula variantesDeModelo() en main.js; se guarda para que la unicidad la garantice
    -- la base de datos y no dependa de que el cliente se acuerde de normalizar.
    clave       text NOT NULL,
    estado      text NOT NULL DEFAULT 'pendiente'
                CHECK (estado IN ('pendiente', 'verificado', 'rechazado')),
    -- Qué dijo la IA al revisarlo, para que el que aprueba tenga una opinión delante.
    ia_veredicto   text,        -- 'real' | 'dudoso' | 'inexistente' | NULL si no se pudo consultar
    ia_confianza   text,        -- 'alta' | 'media' | 'baja'
    ia_motivo      text,
    ia_sugerencia  text,        -- nombre corregido que propone la IA, si propone alguno
    origen      text NOT NULL DEFAULT 'taller'   -- 'semilla' | 'taller'
                CHECK (origen IN ('semilla', 'taller')),
    creado_por  text,           -- empresa_id que lo propuso (NULL en los de semilla)
    creado_en   timestamptz NOT NULL DEFAULT now(),
    resuelto_por text,          -- usuario que aprobó o rechazó
    resuelto_en  timestamptz,
    UNIQUE (marca, clave)
);

-- Qué empresa usa qué modelo. Sirve para saber cuántos talleres distintos lo manejan sin que
-- nadie pueda inflar el número repitiendo productos: la unicidad es por (modelo, empresa).
CREATE TABLE IF NOT EXISTS public.modelos_uso (
    modelo_id  bigint NOT NULL REFERENCES public.modelos_dispositivos(id) ON DELETE CASCADE,
    empresa_id text   NOT NULL,
    creado_en  timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (modelo_id, empresa_id)
);

-- El selector pide "verificados + mis pendientes" ordenado por marca: este índice cubre eso.
CREATE INDEX IF NOT EXISTS idx_modelos_estado_marca
    ON public.modelos_dispositivos (estado, marca);
-- La cola de revisión pide los pendientes más nuevos primero.
CREATE INDEX IF NOT EXISTS idx_modelos_pendientes
    ON public.modelos_dispositivos (creado_en DESC)
    WHERE estado = 'pendiente';
CREATE INDEX IF NOT EXISTS idx_modelos_uso_empresa
    ON public.modelos_uso (empresa_id);

ALTER TABLE public.modelos_dispositivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modelos_uso          ENABLE ROW LEVEL SECURITY;
