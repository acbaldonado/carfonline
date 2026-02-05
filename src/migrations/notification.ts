-- Create notifications table
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  
  -- Reference to the form
  gencode TEXT NOT NULL,
  refid INTEGER NOT NULL,
  
  -- Notification details
  notification_type TEXT NOT NULL, -- 'APPROVAL', 'REJECTION', 'RETURN', 'CANCEL', 'SUBMISSION', 'BOS_SUBMISSION'
  action TEXT NOT NULL, -- 'APPROVED', 'RETURNED', 'CANCELLED', 'SUBMITTED', 'PENDING'
  
  -- User information
  actor_userid TEXT NOT NULL, -- User who performed the action
  actor_name TEXT NOT NULL, -- Name of user who performed action
  recipient_userid TEXT, -- User who should receive notification (nullable for system notifications)
  recipient_name TEXT,
  
  -- Approval flow context
  approval_level TEXT, -- 'FIRST_APPROVER', 'SECOND_APPROVER', 'THIRD_APPROVER', 'COMPLIANCE_FINAL'
  custtype TEXT, -- Customer type from the form
  
  -- Message content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  remarks TEXT, -- Optional remarks/comments
  
  -- Status tracking
  is_read BOOLEAN DEFAULT FALSE,
  is_sent_email BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional context
  form_data JSONB, -- Store relevant form data as JSON
  previous_status TEXT, -- Previous approval status
  new_status TEXT, -- New approval status
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_notifications_gencode ON notifications(gencode);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_userid);
CREATE INDEX idx_notifications_actor ON notifications(actor_userid);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(notification_type);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();