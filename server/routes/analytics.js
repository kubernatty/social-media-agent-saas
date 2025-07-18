const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Record analytics event
router.post('/event', authenticateToken, async (req, res) => {
  try {
    const { event_type, event_data } = req.body;

    if (!event_type) {
      return res.status(400).json({ error: 'Event type is required' });
    }

    const today = new Date().toISOString().split('T')[0];
    const { v4: uuidv4 } = require('uuid');

    // Try to find existing record for today
    const { data: existingRecord, error: fetchError } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('event_type', event_type)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingRecord) {
      // Increment count
      const { error: updateError } = await supabase
        .from('analytics')
        .update({
          count: existingRecord.count + 1,
          event_data: event_data || {}
        })
        .eq('id', existingRecord.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('analytics')
        .insert([
          {
            id: uuidv4(),
            user_id: req.user.id,
            event_type,
            event_data: event_data || {},
            date: today,
            count: 1
          }
        ]);

      if (insertError) {
        throw insertError;
      }
    }

    res.json({ message: 'Event recorded successfully' });
  } catch (error) {
    console.error('Record analytics error:', error);
    res.status(500).json({ error: 'Failed to record event' });
  }
});

// Get user analytics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const { data: analytics, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', req.user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      throw error;
    }

    // Group by event type
    const groupedStats = {};
    (analytics || []).forEach(record => {
      if (!groupedStats[record.event_type]) {
        groupedStats[record.event_type] = {
          total: 0,
          daily: {}
        };
      }
      groupedStats[record.event_type].total += record.count;
      groupedStats[record.event_type].daily[record.date] = record.count;
    });

    res.json({
      stats: groupedStats,
      period: {
        days: parseInt(days),
        start_date: startDate.toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Get analytics summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    const [
      { data: todayStats, error: todayError },
      { data: monthStats, error: monthError }
    ] = await Promise.all([
      supabase
        .from('analytics')
        .select('*')
        .eq('user_id', req.user.id)
        .eq('date', today),
      supabase
        .from('analytics')
        .select('*')
        .eq('user_id', req.user.id)
        .like('date', `${thisMonth}%`)
    ]);

    if (todayError) throw todayError;
    if (monthError) throw monthError;

    const todaySummary = {};
    const monthSummary = {};

    (todayStats || []).forEach(record => {
      todaySummary[record.event_type] = record.count;
    });

    (monthStats || []).forEach(record => {
      if (!monthSummary[record.event_type]) {
        monthSummary[record.event_type] = 0;
      }
      monthSummary[record.event_type] += record.count;
    });

    res.json({
      today: todaySummary,
      thisMonth: monthSummary
    });
  } catch (error) {
    console.error('Get analytics summary error:', error);
    res.status(500).json({ error: 'Failed to get analytics summary' });
  }
});

module.exports = router;