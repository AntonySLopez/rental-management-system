
CREATE OR REPLACE FUNCTION fn_registrar_primer_pago (
    p_cuota_id INT,
    p_metodo_pago TEXT,
    p_monto_pagado NUMERIC
) 
RETURNS INT AS $$
DECLARE
    v_pago_id INT;
BEGIN
    -- 1. Insertamos el registro del pago en la tabla de pago_alquiler
    INSERT INTO pago_alquiler (
        cuota_id, metodo_pago, monto
    ) VALUES (
        p_cuota_id, p_metodo_pago, p_monto_pagado
    )
    RETURNING id INTO v_pago_id;

    -- 2. Actualizamos el estado de la cuota a "pagada"
    UPDATE cuota_alquiler 
    SET estado = 'pagado'
    WHERE id = p_cuota_id;

    -- 3. Retornamos el ID del pago generado
    RETURN v_pago_id;
END;
$$ LANGUAGE plpgsql;