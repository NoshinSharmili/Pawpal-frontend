import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ListRenderItem, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';

const API_BASE = 'http://10.0.2.2:5000/api/posts';
const USER_API_BASE = 'http://10.0.2.2:5000/api/users';

interface Post {
  _id?: string;
  id?: string;
  userId: string;
  content: string;
  reactCount?: number;
  username?: string;
  commentCount?: number; // Add comment count field
}

const CommunityScreen = () => {
  const { userId } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const router = useRouter();

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data: Post[] = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create new post
  const handlePost = async () => {
    if (!newPost.trim() || !userId) return;
    setPosting(true);
    try {
      // First fetch the username using userId
      const userRes = await fetch(`${USER_API_BASE}/${userId}`);
      if (!userRes.ok) throw new Error('Failed to fetch user info');
      const userData = await userRes.json();
      const username = userData.name || 'Anonymous';

      // Create post with username included
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: newPost, 
          userId,
          username 
        }),
      });
      if (!res.ok) throw new Error('Failed to create post');
      setNewPost('');
      fetchPosts();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not create post');
    } finally {
      setPosting(false);
    }
  };

  const fetchCommentsLength = async (postId: string) => {
    const res = await fetch(`http://10.0.2.2:5000/api/comments/post/${postId}`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    const data = await res.json();
    return data.length;
  };

  // React (like) to a post
  const handleReact = async (postId: string) => {
    try {
      const res = await fetch(`${API_BASE}/${postId}/react`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to react');
      fetchPosts();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not react');
    }
  };

  // Delete a post
  const handleDelete = async (postId: string) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const res = await fetch(`${API_BASE}/${postId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            fetchPosts();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Could not delete');
          }
        }
      }
    ]);
  };

  const renderPost: ListRenderItem<Post> = ({ item }) => {
    const name = item.username || 'Anonymous';

    return (
      <View style={styles.card}>
        <View style={styles.postHeader}>
          <Text style={styles.author}>{name}</Text>
          {item.userId === userId && (
            <TouchableOpacity onPress={() => handleDelete(item._id || item.id || '')} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.content}>{item.content}</Text>
        <View style={styles.postActions}>
          <TouchableOpacity onPress={() => handleReact(item._id || item.id || '')} style={styles.reactBtn}>
            <Ionicons name="heart-outline" size={20} color="#f1787e" />
            <Text style={styles.reactText}>{item.reactCount || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push({ pathname: '/(tabs)/PostDetailScreen', params: { postId: item._id || item.id } })}
            style={styles.commentsBtn}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#f1787e" />
            <Text style={styles.commentsText}>comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>No posts yet.</Text>
      <Text style={styles.emptySubtext}>Be the first to share something!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/homepage')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>Community</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Post Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={newPost}
          onChangeText={setNewPost}
          editable={!posting}
          multiline
        />
        <TouchableOpacity 
          style={[styles.postButton, (!newPost.trim() || posting) && styles.postButtonDisabled]}
          onPress={handlePost} 
          disabled={posting || !newPost.trim() || !userId}
        >
          <Text style={styles.postButtonText}>
            {posting ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error/Loading */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f1787e" />
        </View>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={item => item._id || item.id || ''}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: { 
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: '#f1787e',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 16, 
    marginHorizontal: 16,
    marginBottom: 12, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  author: { 
    fontWeight: 'bold', 
    fontSize: 16,
    color: '#f1787e',
  },
  content: { 
    fontSize: 16, 
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  postActions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  reactBtn: { 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  reactText: {
    marginLeft: 4,
    color: '#f1787e',
    fontWeight: '600',
  },
  commentsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  commentsText: {
    marginLeft: 4,
    color: '#f1787e',
    fontWeight: '600',
  },
  deleteBtn: { 
    padding: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  error: { 
    color: '#ff6b6b', 
    textAlign: 'center', 
    marginBottom: 8,
    marginHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});

export default CommunityScreen;
