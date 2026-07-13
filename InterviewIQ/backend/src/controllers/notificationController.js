import Notification from '../models/Notification.js';

// GET /api/notifications  (protected) — most recent first, capped at 50
export async function getNotifications(req, res, next) {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50),
      Notification.countDocuments({ user: req.user._id, isRead: false }),
    ]);

    res.status(200).json({
      success: true,
      notifications: notifications.map((n) => n.toPublicJSON()),
      unreadCount,
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/notifications/read  (protected)
// Body: { id? } — marks a single notification as read if an id is given,
// otherwise marks every notification for this user as read.
export async function markNotificationsRead(req, res, next) {
  try {
    const { id } = req.body;

    if (id) {
      await Notification.updateOne({ _id: id, user: req.user._id }, { $set: { isRead: true } });
    } else {
      await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });
    }

    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

    res.status(200).json({ success: true, unreadCount });
  } catch (err) {
    next(err);
  }
}
