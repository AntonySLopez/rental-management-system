-- tablas de estados
CREATE TABLE estado_general (
    id SERIAL PRIMARY KEY,
    valor VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE estado_garantia (
    id SERIAL PRIMARY KEY,
    estado VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE estado_contrato (
    id SERIAL PRIMARY KEY,
    estado VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE estado_deuda (
	id SERIAL PRIMARY KEY,
	estado VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE metodo_pago (
	id SERIAL PRIMARY KEY,
	metodo VARCHAR(50) NOT NULL UNIQUE
);

create table acceso (
	id serial primary key,
	nombre varchar(20) not null
)

-- tablas principales
CREATE TABLE inquilino (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(110),
    documento VARCHAR(15) UNIQUE,
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    estado_id INT NOT NULL REFERENCES estado_general(id)
);

CREATE TABLE propiedad (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    descripcion VARCHAR(200),
    estado_id INT NOT NULL REFERENCES estado_general(id)
);

CREATE TABLE local (
    id SERIAL PRIMARY KEY,
    propiedad_id INT NOT NULL REFERENCES propiedad(id),
    nombre_local VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    area NUMERIC(10,2),
    estado_id INT NOT NULL REFERENCES estado_general(id),
	contrato_id INT REFERENCES contrato(id)
);

CREATE TABLE contrato (
    id SERIAL PRIMARY KEY,
    inquilino_id INT NOT NULL REFERENCES inquilino(id),
    local_id INT NOT NULL REFERENCES local(id),
    precio_mensual NUMERIC(10,2) NOT NULL,
    duracion_meses INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    observacion VARCHAR(200),
    estado_id INT NOT NULL REFERENCES estado_contrato(id),
    fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
);

CREATE TABLE garantia (
    id SERIAL PRIMARY KEY,
    contrato_id INT NOT NULL REFERENCES contrato(id),
    monto NUMERIC(10,2) NOT NULL,
    fecha_registro DATE NOT NULL,
    fecha_movimiento DATE,
    observaciones VARCHAR(200),
    estado_id INT NOT NULL REFERENCES estado_garantia(id),
	movimiento_id INT REFERENCES movimiento(id)
);

CREATE TABLE cuota_alquiler (
    id SERIAL PRIMARY KEY,
    contrato_id INT NOT NULL REFERENCES contrato(id),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    monto NUMERIC(10,2) NOT NULL,
    monto_pagado NUMERIC(10,2) DEFAULT 0,
    estado_id INT NOT NULL REFERENCES estado_deuda(id)
);

CREATE TABLE consumo_luz (
    id SERIAL PRIMARY KEY,
    contrato_id INT NOT NULL REFERENCES contrato(id),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    lectura_anterior NUMERIC(10,2) NOT NULL DEFAULT 0,
    lectura_actual NUMERIC(10,2),
    precio_kwh NUMERIC(10,2) NOT NULL,
    alumbrado_publico NUMERIC(10,2),
    consumo_total NUMERIC(10,2),
	monto NUMERIC(10,2),
    monto_pagado NUMERIC(10,2) DEFAULT 0,
    estado_id INT NOT NULL REFERENCES estado_deuda(id)
);

CREATE TABLE movimiento (
    id SERIAL PRIMARY KEY,
    contrato_id INT NOT NULL REFERENCES contrato(id),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    monto NUMERIC(10,2) NOT NULL,
    metodo_pago_id INT NOT NULL REFERENCES metodo_pago(id),
    referencia VARCHAR(100),
    descripcion VARCHAR(200)
);

CREATE TABLE aplicacion_pago_alquiler (
    id SERIAL PRIMARY KEY,
    movimiento_id INT NOT NULL REFERENCES movimiento(id),
    cuota_alquiler_id INT NOT NULL REFERENCES cuota_alquiler(id),
    monto_aplicado NUMERIC(10,2) NOT NULL,
    fecha_aplicacion DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE aplicacion_pago_luz (
    id SERIAL PRIMARY KEY,
    movimiento_id INT NOT NULL REFERENCES movimiento(id),
    consumo_luz_id INT NOT NULL REFERENCES consumo_luz(id),
    monto_aplicado NUMERIC(10,2) NOT NULL,
	fecha_aplicacion DATE NOT NULL DEFAULT CURRENT_DATE
);

create table users (
	id serial primary key,
	nombre varchar(100) not null,
	acceso_id int not null references acceso,
	email varchar(255) not null,
	password varchar(200) not null
)

-- Estados

INSERT INTO estado_general (valor) VALUES ('activo');
INSERT INTO estado_general (valor) VALUES ('inactivo');

INSERT INTO estado_contrato (estado) VALUES ('activo');
INSERT INTO estado_contrato (estado) VALUES ('finalizado');
INSERT INTO estado_contrato (estado) VALUES ('cerrado');
INSERT INTO estado_contrato (estado) VALUES ('renovado');

INSERT INTO estado_deuda (estado) VALUES ('pendiente');
INSERT INTO estado_deuda (estado) VALUES ('parcial');
INSERT INTO estado_deuda (estado) VALUES ('pagado');
INSERT INTO estado_deuda (estado) VALUES ('atrasado');
INSERT INTO estado_deuda (estado) VALUES ('activado');

INSERT INTO estado_garantia (estado) VALUES ('retenida');
INSERT INTO estado_garantia (estado) VALUES ('devuelta');
INSERT INTO estado_garantia (estado) VALUES ('aplicada_a_deuda');

INSERT INTO metodo_pago (metodo) VALUES ('efectivo');
INSERT INTO metodo_pago (metodo) VALUES ('yape');
INSERT INTO metodo_pago (metodo) VALUES ('deposito');

insert into acceso (nombre) values ('administrador')