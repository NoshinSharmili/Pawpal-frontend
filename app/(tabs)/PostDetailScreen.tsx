import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ListRenderItem, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';

const API_BASE = 'http://10.0.2.2:5000/api/posts';
const COMMENT_API_BASE = 'http://10.0.2.2:5000/api/comments';

interface Post {
  _id?: string;
  id?: string;
  userId: string;
  content: string;
  reactCount?: number;
  username?: string;
}

interface Comment {
  _id?: string;
  postId: string;
  userId: string;
  text: string;
  username?: string;
  createdAt?: string;
}

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams();
  const { userId } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`${API_BASE}/${postId}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      const data = await res.json();
      setPost(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${COMMENT_API_BASE}/post/${postId}`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleReact = async () => {
    if (!post) return;
    try {
      const res = await fetch(`${API_BASE}/${post._id || post.id}/react`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to react');
      fetchPost(); // Refresh post to get updated react count
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not react');
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !userId || !postId) return;
    setCommentLoading(true);
    try {
      // First fetch the username using userId
      const userRes = await fetch(`http://10.0.2.2:5000/api/users/${userId}`);
      if (!userRes.ok) throw new Error('Failed to fetch user info');
      const userData = await userRes.json();
      const username = userData.name || 'Anonymous';

      const res = await fetch(COMMENT_API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          userId,
          text: newComment,
          username
        }),
      });
      if (!res.ok) throw new Error('Failed to create comment');
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not create comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const renderComment: ListRenderItem<Comment> = ({ item }) => (
    <View style={styles.commentCard}>
      <Text style={styles.commentAuthor}>{item.username || 'Anonymous'}</Text>
      <Text style={styles.commentContent}>{item.text}</Text>
      <Text style={styles.commentDate}>
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f1787e" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.centered}>
        <Text>Post not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f1787e" />
        </TouchableOpacity>
        <Text style={styles.title}>Post</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Post */}
      <View style={styles.postCard}>
        <Text style={styles.author}>{post.username || 'Anonymous'}</Text>
        <Text style={styles.content}>{post.content}</Text>
        <TouchableOpacity onPress={handleReact} style={styles.reactBtn}>
          <Ionicons name="heart-outline" size={20} color="#f1787e" />
          <Text style={styles.reactText}>{post.reactCount || 0}</Text>
        </TouchableOpacity>
      </View>

      {/* Comment Form */}
      <View style={styles.commentForm}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          editable={!commentLoading}
        />
        <TouchableOpacity
          onPress={handleComment}
          disabled={commentLoading || !newComment.trim()}
          style={[styles.sendButton, (!newComment.trim() || commentLoading) && styles.sendButtonDisabled]}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={(!newComment.trim() || commentLoading) ? "#ccc" : "#f1787e"} 
          />
        </TouchableOpacity>
      </View>

      {/* Comments */}
      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
        <FlatList
          data={comments}
          keyExtractor={item => item._id || ''}
          renderItem={renderComment}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.emptyComments}>No comments yet. Be the first to comment!</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  postCard: {
    backgroundColor: '#f9f9f9',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  author: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  reactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  reactText: {
    marginLeft: 4,
    color: '#f1787e',
    fontWeight: '600',
  },
  commentForm: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  commentInput: {
    flex: 1,
    borderWidth: 0,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1787e',
  },
  sendButtonDisabled: {
    borderColor: '#ccc',
  },
  commentsSection: {
    flex: 1,
    margin: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  commentCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#f1787e',
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
  },
  emptyComments: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
});
