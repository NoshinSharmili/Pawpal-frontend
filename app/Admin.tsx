import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView
  
} from 'react-native';

export default function AdminDashboardScreen() {
  // Dashboard stats data
  const [stats] = useState({
    totalUsers: 1247,
    totalPets: 3892,
    newThisWeek: 156,
    systemUptime: '98.5%'
  });

  // Recent activity data
  const [recentActivity] = useState([
    { id: 1, text: 'New user registered: Sarah Johnson', time: '2 min ago' },
    { id: 2, text: 'Pet profile updated: Max (Golden Retriever)', time: '5 min ago' },
    { id: 3, text: 'Adoption status changed: Luna (Persian Cat)', time: '12 min ago' },
    { id: 4, text: 'New pet registered: Buddy (Labrador)', time: '18 min ago' },
  ]);

  const handleSectionPress = (section) => {
  console.log('Navigate to', section);
};

const handleQuickAction = (action) => {
  console.log('Execute:', action);
};
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PawPal Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage your pet community with love and care</Text>
          <Text style={styles.petIcon}>🐾</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalUsers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalPets.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Registered Pets</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.newThisWeek}</Text>
              <Text style={styles.statLabel}>New This Week</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.systemUptime}</Text>
              <Text style={styles.statLabel}>System Uptime</Text>
            </View>
          </View>
        </View>

        {/* Admin Sections */}
        <View style={styles.sectionsContainer}>
          <TouchableOpacity 
            style={styles.adminSection}
            onPress={() => handleSectionPress('User Management')}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Text style={styles.iconText}>👥</Text>
              </View>
              <Text style={styles.sectionTitle}>User Management</Text>
            </View>
            <View style={styles.actionList}>
              <Text style={styles.actionItem}>• View All Users</Text>
              <Text style={styles.actionItem}>• Manage User Roles</Text>
              <Text style={styles.actionItem}>• Suspended Accounts</Text>
              <Text style={styles.actionItem}>• User Reports</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.adminSection}
            onPress={() => handleSectionPress('Pet Management')}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Text style={styles.iconText}>🐕</Text>
              </View>
              <Text style={styles.sectionTitle}>Pet Management</Text>
            </View>
            <View style={styles.actionList}>
              <Text style={styles.actionItem}>• All Pet Profiles</Text>
              <Text style={styles.actionItem}>• Pet Categories</Text>
              <Text style={styles.actionItem}>• Adoption Status</Text>
              <Text style={styles.actionItem}>• Lost Pet Reports</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.adminSection}
            onPress={() => handleSectionPress('Analytics')}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Text style={styles.iconText}>📊</Text>
              </View>
              <Text style={styles.sectionTitle}>Analytics</Text>
            </View>
            <View style={styles.actionList}>
              <Text style={styles.actionItem}>• User Engagement</Text>
              <Text style={styles.actionItem}>• Popular Breeds</Text>
              <Text style={styles.actionItem}>• Growth Statistics</Text>
              <Text style={styles.actionItem}>• Export Reports</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.adminSection}
            onPress={() => handleSectionPress('System Settings')}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Text style={styles.iconText}>⚙️</Text>
              </View>
              <Text style={styles.sectionTitle}>System Settings</Text>
            </View>
            <View style={styles.actionList}>
              <Text style={styles.actionItem}>• App Configuration</Text>
              <Text style={styles.actionItem}>• Backup & Restore</Text>
              <Text style={styles.actionItem}>• Security Settings</Text>
              <Text style={styles.actionItem}>• System Logs</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => handleQuickAction('Send Notification')}
            >
              <Text style={styles.actionBtnText}>Send Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => handleQuickAction('Export Data')}
            >
              <Text style={styles.actionBtnText}>Export Data</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => handleQuickAction('System Backup')}
            >
              <Text style={styles.actionBtnText}>System Backup</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => handleQuickAction('View Reports')}
            >
              <Text style={styles.actionBtnText}>View Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{activity.text}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#C74C58',
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  petIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    fontSize: 40,
    transform: [{ translateY: -20 }],
  },
  statsContainer: {
    backgroundColor: '#FFE9EC',
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    width: '48%',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#C74C58',
    // iOS shadow
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#C74C58',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sectionsContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  adminSection: {
    backgroundColor: '#FFE9EC',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    width: '48%',
    // iOS shadow
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#C74C58',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C74C58',
    flex: 1,
  },
  actionList: {
    marginTop: 8,
  },
  actionItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  quickActions: {
    backgroundColor: '#C74C58',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    padding: 14,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  recentActivity: {
    backgroundColor: '#FFE9EC',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    // iOS shadow
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C74C58',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityDot: {
    width: 8,
    height: 8,
    backgroundColor: '#C74C58',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});