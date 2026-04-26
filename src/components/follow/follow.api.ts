import React, { useEffect, useState } from 'react';

interface Props {
  userId: string; // target user
}

const FollowCard: React.FC<Props> = ({ userId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, countRes] = await Promise.all([
          fetch(`/api/follow/status/${userId}`),
          fetch(`/api/follow/count/${userId}`),
        ]);

        const status = await statusRes.json();
        const counts = await countRes.json();

        setIsFollowing(status);
        setFollowers(counts.followers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [userId]);

  // 🔹 Handle follow/unfollow
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isFollowing) {
        await fetch(`/api/follow/${userId}`, {
          method: 'DELETE',
        });

        setIsFollowing(false);
        setFollowers((prev) => prev - 1); // optimistic
      } else {
        await fetch(`/api/follow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        setIsFollowing(true);
        setFollowers((prev) => prev + 1); // optimistic
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl w-fit">
      <p className="text-sm mb-2">
        <strong>{followers}</strong> Followers
      </p>

      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            isFollowing
              ? 'bg-gray-700'
              : 'bg-green-600 hover:bg-green-500'
          }`}
        >
          {loading
            ? 'Processing...'
            : isFollowing
            ? 'Unfollow'
            : 'Follow'}
        </button>
      </form>
    </div>
  );
};

export default FollowCard;