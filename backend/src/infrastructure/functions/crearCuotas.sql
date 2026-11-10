
CREATE OR REPLACE FUNCTION fn_generar_cuotas_alquiler(
    p_contrato_id INT,
    p_fecha_inicio DATE,
    p_total_meses INT,
    p_monto NUMERIC
) 
RETURNS INT[] AS $$
DECLARE
    i INT;
    v_f_inicio DATE := p_fecha_inicio;
    v_f_vencimiento DATE;
    v_id_insertado INT;
    v_todos_los_ids INT[] := '{}'; -- Un array vacío para los id
BEGIN
    -- Iteramos por cada mes
    FOR i IN 1..p_total_meses LOOP
        v_f_vencimiento := v_f_inicio + INTERVAL '1 month';

        INSERT INTO cuota_alquiler (
            contrato_id, fecha_inicio, fecha_vencimiento, monto
        ) VALUES (
            p_contrato_id, v_f_inicio, v_f_vencimiento, p_monto
        )
        RETURNING id INTO v_id_insertado;

        v_todos_los_ids := array_append(v_todos_los_ids, v_id_insertado);

        v_f_inicio := v_f_vencimiento;
    END LOOP;

    -- Retornamos el array con todos los IDs generados
    RETURN v_todos_los_ids;
END;
$$ LANGUAGE plpgsql;