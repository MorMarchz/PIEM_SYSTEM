import pool from '../config/db.js';

/**
 * Asynchronous Audit Logging Service
 * Records system security and transaction events into `audit_logs` table
 * Non-blocking execution wrapped in try-catch to ensure API flows never break
 */
export const logAuditEvent = async ({
  actor_user_id = null,
  action,
  entity_type,
  entity_id = null,
  old_value = null,
  new_value = null,
  ip_address = null,
  req = null,
}) => {
  try {
    // Extract IP Address from Request if provided
    let clientIp = ip_address;
    if (!clientIp && req) {
      clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || req.ip || null;
    }

    // Format JSON values
    const formattedOldValue = old_value ? JSON.stringify(old_value) : null;
    const formattedNewValue = new_value ? JSON.stringify(new_value) : null;

    // Asynchronously insert log record
    await pool.query(
      `INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, old_value, new_value, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        actor_user_id,
        action,
        entity_type,
        entity_id,
        formattedOldValue,
        formattedNewValue,
        clientIp,
      ]
    );
  } catch (error) {
    // Non-blocking log warning, never rethrow to prevent breaking main API response
    console.error('[Audit Service Warning]: Failed to record audit log:', error.message);
  }
};

export default logAuditEvent;
