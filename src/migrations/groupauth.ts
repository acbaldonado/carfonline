-- Create groupauthorizations table
CREATE TABLE IF NOT EXISTS public.groupauthorizations (
    id BIGSERIAL PRIMARY KEY,
    groupcode TEXT NOT NULL,
    menucmd TEXT NOT NULL,
    accesslevel TEXT NOT NULL CHECK (accesslevel IN ('FULL', 'NONE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Unique constraint: one authorization per group per menu/program
    CONSTRAINT unique_group_menu UNIQUE (groupcode, menucmd)
);

-- Add foreign key constraint to usergroups (if you want strict referential integrity)
-- ALTER TABLE public.groupauthorizations
--     ADD CONSTRAINT fk_groupcode 
--     FOREIGN KEY (groupcode) 
--     REFERENCES public.usergroups(groupcode) 
--     ON DELETE CASCADE;

-- Add foreign key constraint to schemas (if you want strict referential integrity)
-- ALTER TABLE public.groupauthorizations
--     ADD CONSTRAINT fk_menucmd 
--     FOREIGN KEY (menucmd) 
--     REFERENCES public.schemas(menucmd) 
--     ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_groupauthorizations_groupcode 
    ON public.groupauthorizations(groupcode);

CREATE INDEX IF NOT EXISTS idx_groupauthorizations_menucmd 
    ON public.groupauthorizations(menucmd);

-- Enable Row Level Security (RLS)
ALTER TABLE public.groupauthorizations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read
CREATE POLICY "Allow authenticated users to read groupauthorizations"
    ON public.groupauthorizations
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert groupauthorizations"
    ON public.groupauthorizations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update groupauthorizations"
    ON public.groupauthorizations
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete groupauthorizations"
    ON public.groupauthorizations
    FOR DELETE
    TO authenticated
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_groupauthorizations_updated_at
    BEFORE UPDATE ON public.groupauthorizations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.groupauthorizations TO authenticated;
GRANT ALL ON public.groupauthorizations TO service_role;

-- Grant sequence permissions
GRANT USAGE, SELECT ON SEQUENCE public.groupauthorizations_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.groupauthorizations_id_seq TO service_role;

-- Add comments for documentation
COMMENT ON TABLE public.groupauthorizations IS 'Stores authorization levels for user groups on different modules and programs';
COMMENT ON COLUMN public.groupauthorizations.groupcode IS 'Reference to usergroups.groupcode';
COMMENT ON COLUMN public.groupauthorizations.menucmd IS 'Reference to schemas.menucmd';
COMMENT ON COLUMN public.groupauthorizations.accesslevel IS 'Access level: FULL or NONE';