SELECT v.id as version_id,
JSON_OBJECT(
  'version', v.version,
  'name', v.name,
'date', v.date,
'pass', v.pass_default,
'headerSync', v.sync_header,
'sync', v.sync_dec,
'model', dm.name,
'brand', db.name,
'commands',(SELECT
			JSON_ARRAYAGG(JSON_OBJECT(

				'command', dc.command,
				'label', dc.label,
				'type', lower(dc.type),
				'description',dc.description,
				'note',dc.note,
				'usePass',dc.use_pass,
				'useTag',dc.use_tag,
				'level',dc.level,
				'exportable',dc.exportable,
				'indexed',dc.w_index,
				'fields', (SELECT
				  JSON_ARRAYAGG(JSON_OBJECT(
						'name', dp.param,
						'label', dp.title,
						'control', CASE dp.type_value WHEN 1 then 'select' when 2 then 'bitwise' else 'text' end,
						'mode', lower(dp.type),
						'default', dp.default_value,
						'description',dp.description,
                        'data', (SELECT
								  JSON_ARRAYAGG(JSON_ARRAY(
									  pv.value, pv.title
								  )) as p_values
									FROM device_param_value as pv
									WHERE pv.param_id = dp.id
									group by pv.param_id
									ORDER BY `value`)
                        ))

					  FROM device_comm_param as dp
					  WHERE dp.command_id = dc.id

					  group by dp.command_id
					  ORDER BY `order`)))
		FROM device_command as dc
		WHERE dc. version_id = v.id
		GROUP BY version_id
        ORDER BY dc.command)) as xx

FROM device_version v
INNER JOIN device_model as dm ON dm.id=v.id_model
INNER JOIN device_brand as db on db.id = id_brand
WHERE v.id=43
order by v.id