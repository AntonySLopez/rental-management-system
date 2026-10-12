
# Inquilino

```postgresql
CREATE TABLE inquilino (
    id              BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre          VARCHAR(200)        NOT NULL,
    telefono        VARCHAR(9),
    email           VARCHAR(100),
    documento       VARCHAR(8)        NOT NULL,
    fecha_registro  TIMESTAMPTZ NOT NULL DEFAULT now(),
    estado          TEXT        NOT NULL DEFAULT 'activo',

    CONSTRAINT pk_inquilino PRIMARY KEY (id),
    CONSTRAINT uq_inquilino_documento UNIQUE (documento),
    CONSTRAINT ck_inquilino_nombre CHECK (length(btrim(nombre)) > 0),
    CONSTRAINT ck_inquilino_documento CHECK (documento ~ '^[0-9]{8}$'),
    CONSTRAINT ck_inquilino_telefono CHECK (telefono ~ '^[0-9]{9}$'),
    CONSTRAINT ck_inquilino_estado CHECK (estado IN ('activo', 'inactivo'))
);
```

# Local

```postgresql
CREATE TABLE local (
    id           BIGINT GENERATED ALWAYS AS IDENTITY,
    nombre       VARCHAR(100)          NOT NULL,
    descripcion  VARCHAR(255),
    area         NUMERIC(8,2)  NOT NULL,
    estado       TEXT          NOT NULL DEFAULT 'libre',

    CONSTRAINT pk_local PRIMARY KEY (id),
    CONSTRAINT uq_local_nombre UNIQUE (nombre),
    CONSTRAINT ck_local_nombre CHECK (length(btrim(nombre)) > 0),
    CONSTRAINT ck_local_area CHECK (area > 0  AND area <= 1000),
    CONSTRAINT ck_local_estado CHECK (estado IN ('libre', 'ocupado', 'mantenimiento'))
);
```

# Contrato

```postgresql
CREATE TABLE contrato (
    id              BIGINT GENERATED ALWAYS AS IDENTITY,
    inquilino_id    BIGINT        NOT NULL,
    local_id        BIGINT        NOT NULL,
    precio_mensual  NUMERIC(12,2) NOT NULL,
    garantia        NUMERIC(12,2),
    lectura_inicial_luz NUMERIC(12,2) NOT NULL,
    fecha_creacion  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    fecha_inicio    DATE          NOT NULL,
    fecha_fin       DATE          NOT NULL,
    observaciones   VARCHAR(255),
    estado          TEXT          NOT NULL DEFAULT 'activo',
	metodo_pago     TEXT          NOT NULL DEFAULT 'efectivo',
	referencia      VARCHAR(100),

    CONSTRAINT pk_contrato PRIMARY KEY (id),
    CONSTRAINT fk_contrato_inquilino FOREIGN KEY (inquilino_id)
        REFERENCES inquilino (id) ON DELETE RESTRICT,
    CONSTRAINT fk_contrato_local FOREIGN KEY (local_id)
        REFERENCES local (id) ON DELETE RESTRICT,
    CONSTRAINT ck_contrato_precio CHECK (precio_mensual > 0),
    CONSTRAINT ck_contrato_lectura_inicial CHECK (lectura_inicial_luz >= 0),
    CONSTRAINT ck_contrato_fechas CHECK (fecha_fin > fecha_inicio),
    CONSTRAINT ck_contrato_estado CHECK (
        estado IN ('activo', 'finalizado', 'renovado', 'cerrado')
    ),
    CONSTRAINT ck_metodo_pago CHECK (
	    metodo_pago IN ('efectivo', 'transferencia', 'deposito_bancario')
    )
);

CREATE UNIQUE INDEX uq_contrato_local_vigente
    ON contrato (local_id)
    WHERE estado IN ('activo', 'renovado');

CREATE INDEX idx_contrato_inquilino ON contrato (inquilino_id);
CREATE INDEX idx_contrato_local ON contrato (local_id);
```

# Garantía

```postgresql
CREATE TABLE garantia (
    id              BIGINT GENERATED ALWAYS AS IDENTITY,
    contrato_id     BIGINT        NOT NULL,
    monto           NUMERIC(12,2) NOT NULL,
    fecha_registro  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    fecha_cierre    TIMESTAMPTZ,
    observaciones   VARCHAR(255),
    estado          TEXT          NOT NULL,

    CONSTRAINT pk_garantia PRIMARY KEY (id),
    CONSTRAINT uq_garantia_contrato UNIQUE (contrato_id),
    CONSTRAINT fk_garantia_contrato FOREIGN KEY (contrato_id)
        REFERENCES contrato (id) ON DELETE RESTRICT,
    CONSTRAINT ck_garantia_monto CHECK (monto > 0),
    CONSTRAINT ck_garantia_estado CHECK (
        estado IN ('retenida', 'devuelta', 'consumida')
    ),
    CONSTRAINT ck_garantia_cierre CHECK (
        (estado = 'retenida') = (fecha_cierre IS NULL)
    )
)
```

# Movimiento garantia

```postgresql
CREATE TABLE movimiento_garantia (
    id              BIGINT GENERATED ALWAYS AS IDENTITY,
    garantia_id     BIGINT        NOT NULL,
    fecha_registro  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    monto           NUMERIC(12,2) NOT NULL,
    metodo_pago     TEXT          NOT NULL,
    referencia      VARCHAR(100),
    tipo_accion     TEXT          NOT NULL,
    observaciones   VARCHAR(255),

    CONSTRAINT pk_movimiento_garantia PRIMARY KEY (id),
    CONSTRAINT fk_movimiento_garantia_garantia FOREIGN KEY (garantia_id)
        REFERENCES garantia (id) ON DELETE RESTRICT,
    CONSTRAINT ck_movimiento_garantia_monto CHECK (monto > 0),
    CONSTRAINT ck_movimiento_garantia_metodo CHECK (
        metodo_pago IN ('efectivo', 'transferencia', 'deposito_bancario')
    ),
    CONSTRAINT ck_movimiento_garantia_tipo CHECK (
        tipo_accion IN ('deposito', 'devuelta', 'consumida')
    ),
    CONSTRAINT ck_movimiento_garantia_consumo CHECK (
        tipo_accion <> 'consumida' OR metodo_pago = 'deposito'
    )
);

CREATE INDEX idx_movimiento_garantia_garantia
    ON movimiento_garantia (garantia_id);
```


# Cuotas alquiler

```postgresql
CREATE TABLE cuota_alquiler (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY,
    contrato_id        BIGINT        NOT NULL,
    fecha_inicio       DATE          NOT NULL,
    fecha_vencimiento  DATE          NOT NULL,
    monto              NUMERIC(12,2) NOT NULL,
    estado             TEXT          NOT NULL DEFAULT 'pendiente',

    CONSTRAINT pk_cuota_alquiler PRIMARY KEY (id),
    CONSTRAINT fk_cuota_alquiler_contrato FOREIGN KEY (contrato_id)
        REFERENCES contrato (id) ON DELETE RESTRICT,
    CONSTRAINT ck_cuota_alquiler_monto CHECK (monto > 0),
    CONSTRAINT ck_cuota_alquiler_fechas CHECK (fecha_vencimiento >= fecha_inicio),
    CONSTRAINT ck_cuota_alquiler_estado CHECK (
        estado IN ('pendiente', 'activo', 'atrasado', 'pagado', 'anulada')
    )
);

CREATE UNIQUE INDEX uq_cuota_alquiler_periodo_vigente
    ON cuota_alquiler (contrato_id, fecha_inicio)
    WHERE estado <> 'anulada';

CREATE INDEX idx_cuota_alquiler_contrato ON cuota_alquiler (contrato_id);
```


# Pago alquiler

```postgresql
CREATE TABLE pago_alquiler (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY,
    cuota_alquiler_id  BIGINT        NOT NULL,
    monto              NUMERIC(12,2) NOT NULL,
    metodo_pago        TEXT          NOT NULL,
    referencia         VARCHAR(100),
    fecha_registro     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    observaciones      VARCHAR(255),

    CONSTRAINT pk_pago_alquiler PRIMARY KEY (id),
    CONSTRAINT fk_pago_alquiler_cuota_alquiler FOREIGN KEY (cuota_alquiler_id)
        REFERENCES cuota_alquiler (id) ON DELETE RESTRICT,
    CONSTRAINT uq_pago_alquiler_cuota_alquiler UNIQUE (cuota_alquiler_id),
    CONSTRAINT ck_pago_alquiler_monto CHECK (monto > 0),
    CONSTRAINT ck_pago_alquiler_metodo CHECK (
        metodo_pago IN ('efectivo', 'transferencia', 'deposito_bancario')
    )
);
```


# Consumo luz


```postgresql
CREATE TABLE consumo_luz (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY,
    contrato_id        BIGINT        NOT NULL,
    fecha_inicio       DATE          NOT NULL,
    fecha_fin          DATE          NOT NULL,
    lectura_anterior   NUMERIC(12,2) NOT NULL,
    lectura_actual     NUMERIC(12,2) NOT NULL,
    consumo_kwh_total  NUMERIC(12,2) GENERATED ALWAYS AS
                           (lectura_actual - lectura_anterior) STORED,
    precio_kwh         NUMERIC(10,4) NOT NULL,
    alumbrado_publico  NUMERIC(12,2) NOT NULL DEFAULT 0,
    monto              NUMERIC(12,2) NOT NULL,
    estado             TEXT          NOT NULL DEFAULT 'pendiente',

    CONSTRAINT pk_consumo_luz PRIMARY KEY (id),
    CONSTRAINT fk_consumo_luz_contrato FOREIGN KEY (contrato_id)
        REFERENCES contrato (id) ON DELETE RESTRICT,
    CONSTRAINT ck_consumo_luz_fechas CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT ck_consumo_luz_lecturas CHECK (
        lectura_anterior >= 0 AND lectura_actual >= lectura_anterior
    ),
    CONSTRAINT ck_consumo_luz_precio CHECK (precio_kwh > 0),
    CONSTRAINT ck_consumo_luz_alumbrado CHECK (alumbrado_publico >= 0),
    CONSTRAINT ck_consumo_luz_monto CHECK (monto >= 0),
    CONSTRAINT ck_consumo_luz_estado CHECK (
        estado IN ('pendiente', 'pagado', 'anulada')
    )
);

CREATE UNIQUE INDEX uq_consumo_luz_periodo_vigente
    ON consumo_luz (contrato_id, fecha_inicio)
    WHERE estado <> 'anulada';

CREATE INDEX idx_consumo_luz_contrato ON consumo_luz (contrato_id);
```


# Pago consumo


```postgresql
CREATE TABLE pago_consumo (
    id              BIGINT GENERATED ALWAYS AS IDENTITY,
    consumo_luz_id  BIGINT        NOT NULL,
    monto           NUMERIC(12,2) NOT NULL,
    metodo_pago     TEXT          NOT NULL,
    referencia      VARCHAR(100),
    fecha_registro  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    observaciones   VARCHAR(255),

    CONSTRAINT pk_pago_consumo PRIMARY KEY (id),
    CONSTRAINT fk_pago_consumo_consumo_luz FOREIGN KEY (consumo_luz_id)
        REFERENCES consumo_luz (id) ON DELETE RESTRICT,
    CONSTRAINT uq_pago_consumo_consumo_luz UNIQUE (consumo_luz_id),
    CONSTRAINT ck_pago_consumo_monto CHECK (monto > 0),
    CONSTRAINT ck_pago_consumo_metodo CHECK (
        metodo_pago IN ('efectivo', 'transferencia', 'deposito_bancario')
    )
);
```