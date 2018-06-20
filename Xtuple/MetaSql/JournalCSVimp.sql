UPDATE glseries
SET glseries_accnt_id =( SELECT accnt_id 
			 FROM accnt 
			 WHERE ( CONCAT(accnt_number,accnt_sub)) = CAST(glseries_accnt_id AS TEXT)),
    glseries_docnumber = ''
WHERE glseries_docnumber = 'CSVimp'