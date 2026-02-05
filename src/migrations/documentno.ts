-- Drop old function if exists
DROP FUNCTION IF EXISTS generate_carf_doc_no();

-- Create the new function
CREATE OR REPLACE FUNCTION generate_carf_doc_no()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    next_no BIGINT;
    formatted_doc_no TEXT;
BEGIN
    -- Get the next number based on current max numeric part of doc_no
    SELECT COALESCE(MAX(CAST(SPLIT_PART(c.doc_no, '-', 2) AS BIGINT)), 0) + 1
    INTO next_no
    FROM public.carf_documents c
    WHERE c.doc_no ~ '^CARF-\d+$';

    -- Format the doc_no as CARF-000000000X
    formatted_doc_no := 'CARF-' || LPAD(next_no::TEXT, 10, '0');

    -- Update only the row with id = 1
    UPDATE public.carf_documents
    SET doc_no = formatted_doc_no,
        created_at = NOW()
    WHERE id = 1
    RETURNING doc_no INTO formatted_doc_no;

    RETURN formatted_doc_no;
END;
$$;




CREATE TABLE carf_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doc_no TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


SELECT * FROM generate_carf_doc_no();