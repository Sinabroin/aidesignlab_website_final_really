'use client';

import { useState } from 'react';
import ACECommunitySection from '@/components/sections/ACECommunitySection';
import GalleryModal from '@/components/GalleryModal';
import WritePost, { type EditPostData } from '@/components/WritePost';
import type { GalleryItem } from '@/types';

/**
 * ACE 커뮤니티 Client Component
 */
export default function ACECommunitySectionClient() {
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [editData, setEditData] = useState<EditPostData | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<GalleryItem[]>([]);
  const [currentModalIndex, setCurrentModalIndex] = useState(0);

  const openModal = (items: GalleryItem[], index: number) => {
    setModalItems(items);
    setCurrentModalIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleWriteClick = () => {
    setEditData(undefined);
    setShowWriteModal(true);
  };

  const handleEditPost = (item: GalleryItem) => {
    setEditData({
      id: item.id!,
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags,
      thumbnail: item.thumbnail,
      attachments: item.attachments,
    });
    setShowWriteModal(true);
  };

  return (
    <>
      <ACECommunitySection
        key={refreshKey}
        onWriteClick={handleWriteClick}
        onCardClick={openModal}
      />

      {showWriteModal && (
        <WritePost
          onClose={() => { setShowWriteModal(false); setEditData(undefined); }}
          section="activity"
          onPublished={() => { setRefreshKey((k) => k + 1); setEditData(undefined); }}
          editData={editData}
        />
      )}

      <GalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        items={modalItems}
        currentIndex={currentModalIndex}
        onNavigate={setCurrentModalIndex}
        section="activity"
        onDelete={() => { setIsModalOpen(false); setRefreshKey((k) => k + 1); }}
        onEdit={handleEditPost}
      />
    </>
  );
}
