'use client';

import { useState } from 'react';
import ACECommunitySection from '@/components/sections/ACECommunitySection';
import GalleryModal from '@/components/GalleryModal';
import WritePost from '@/components/WritePost';
import type { GalleryItem } from '@/types';

/**
 * ACE 커뮤니티 Client Component
 */
export default function ACECommunitySectionClient() {
  const [showWriteModal, setShowWriteModal] = useState(false);
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
    setShowWriteModal(true);
  };

  return (
    <>
      <ACECommunitySection
        key={refreshKey}
        onWriteClick={handleWriteClick}
        onCardClick={openModal}
      />

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <WritePost
          onClose={() => setShowWriteModal(false)}
          section="activity"
          onPublished={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {/* 갤러리 모달 */}
      <GalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        items={modalItems}
        currentIndex={currentModalIndex}
        onNavigate={setCurrentModalIndex}
        section="activity"
      />
    </>
  );
}
