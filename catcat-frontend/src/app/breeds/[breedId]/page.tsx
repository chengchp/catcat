'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ArrowLeft, ExternalLink, Heart, Activity, Brain, Star, ArrowRight } from 'lucide-react'
import { breedApi, type Breed } from '@/lib/api'

export default function BreedDetailPage() {
  const params = useParams()
  const breedId = params.breedId as string
  const [breed, setBreed] = useState<Breed | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBreed()
  }, [breedId])

  const loadBreed = async () => {
    try {
      setLoading(true)
      const response = await breedApi.getById(breedId)
      if (response.success) {
        setBreed(response.data)
      }
    } catch (error) {
      console.error('Failed to load breed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
                <div className="flex items-center justify-center py-40">
          <div className="animate-spin w-12 h-12 border-4 border-caramel border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  if (!breed) {
    return (
      <div className="min-h-screen bg-cream">
                <div className="flex flex-col items-center justify-center py-40">
          <span className="text-6xl mb-4">😿</span>
          <p className="text-warmblack/60 font-body text-lg mb-4">品种不存在</p>
          <Link href="/breeds" className="text-caramel font-display font-semibold hover:underline">
            返回品种列表
          </Link>
        </div>
      </div>
    )
  }

  // 评分星星
  const RatingStars = ({ value, max = 5 }: { value: number; max?: number }) => (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < (value || 0) ? 'text-caramel fill-caramel' : 'text-gray-300'}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-cream">
      
      {/* Back Button */}
      <div className="py-4 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/breeds"
            className="inline-flex items-center gap-2 text-warmblack/60 hover:text-caramel font-display text-sm transition-colors"
          >
            <ArrowLeft size={18} />
            返回品种列表
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-caramel/10">
              {breed.imageUrl ? (
                <Image
                  src={breed.imageUrl}
                  alt={breed.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl">🐱</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-warmblack mb-2">
                {breed.name}
              </h1>
              <p className="text-warmblack/60 font-body text-lg mb-6">
                {breed.origin}
              </p>

              {/* Temperament Tags */}
              {breed.temperament && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {breed.temperament.split(',').map(tag => (
                    <span
                      key={tag.trim()}
                      className="px-3 py-1 bg-caramel/10 text-caramel rounded-full font-body text-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-warmblack/40 font-body text-sm mb-1">寿命</p>
                  <p className="font-display font-bold text-warmblack">{breed.lifeSpan} 年</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-warmblack/40 font-body text-sm mb-1">体重</p>
                  <p className="font-display font-bold text-warmblack">{breed.weightMetric} kg</p>
                </div>
              </div>

              {/* Description */}
              {breed.description && (
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                  <h3 className="font-display font-bold text-warmblack mb-3">关于品种</h3>
                  <p className="text-warmblack/70 font-body leading-relaxed">
                    {breed.description}
                  </p>
                </div>
              )}

              {/* Wikipedia Link */}
              {breed.wikipediaUrl && (
                <a
                  href={breed.wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-caramel font-display font-semibold hover:underline"
                >
                  <ExternalLink size={18} />
                  维基百科
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12 bg-warmblack/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-warmblack mb-8 text-center">
            性格特点
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Adaptability */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-caramel/10 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-caramel" />
                </div>
                <div>
                  <p className="font-display font-semibold text-warmblack">适应能力</p>
                  <p className="text-warmblack/40 font-body text-sm">Adaptability</p>
                </div>
              </div>
              <RatingStars value={breed.adaptability} />
            </div>

            {/* Affection Level */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-caramel/10 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-caramel" />
                </div>
                <div>
                  <p className="font-display font-semibold text-warmblack">亲人程度</p>
                  <p className="text-warmblack/40 font-body text-sm">Affection Level</p>
                </div>
              </div>
              <RatingStars value={breed.affectionLevel} />
            </div>

            {/* Intelligence */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-caramel/10 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-caramel" />
                </div>
                <div>
                  <p className="font-display font-semibold text-warmblack">智力</p>
                  <p className="text-warmblack/40 font-body text-sm">Intelligence</p>
                </div>
              </div>
              <RatingStars value={breed.intelligence} />
            </div>

            {/* Energy Level */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-caramel/10 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-caramel" />
                </div>
                <div>
                  <p className="font-display font-semibold text-warmblack">能量等级</p>
                  <p className="text-warmblack/40 font-body text-sm">Energy Level</p>
                </div>
              </div>
              <RatingStars value={breed.energyLevel} />
            </div>

            {/* Health Issues */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-caramel/10 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-caramel" />
                </div>
                <div>
                  <p className="font-display font-semibold text-warmblack">健康问题</p>
                  <p className="text-warmblack/40 font-body text-sm">Health Issues</p>
                </div>
              </div>
              <RatingStars value={breed.healthIssues} />
            </div>

            {/* Grooming */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-caramel/10 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-caramel" />
                </div>
                <div>
                  <p className="font-display font-semibold text-warmblack">美容需求</p>
                  <p className="text-warmblack/40 font-body text-sm">Grooming</p>
                </div>
              </div>
              <RatingStars value={breed.grooming} />
            </div>
          </div>
        </div>
      </section>

      {/* Compatibility Section */}
      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-warmblack mb-8 text-center">
            兼容性评估
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <p className="text-warmblack/60 font-body text-sm mb-2">儿童友好</p>
              <RatingStars value={breed.childFriendly} />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <p className="text-warmblack/60 font-body text-sm mb-2">狗狗友好</p>
              <RatingStars value={breed.dogFriendly} />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <p className="text-warmblack/60 font-body text-sm mb-2">陌生人友好</p>
              <RatingStars value={breed.strangerFriendly} />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <p className="text-warmblack/60 font-body text-sm mb-2">社交需求</p>
              <RatingStars value={breed.socialNeeds} />
            </div>
          </div>
        </div>
      </section>

      {/* Adopt CTA */}
      <section className="px-4 py-16 bg-caramel">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            想要领养一只 {breed.name} 吗？
          </h2>
          <p className="text-white/80 font-body text-lg mb-8">
            来云领养系统抽取一只属于你的 {breed.name}，它将陪伴你的虚拟生活
          </p>
          <Link
            href="/adopt"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-caramel font-display font-bold rounded-xl hover:bg-cream transition-all duration-300"
          >
            <Heart size={20} />
            云领养
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-warmblack text-cream">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-cream/60 font-body">
            © 2024 CatCat. 用爱守护每一只猫咪 🐱
          </p>
        </div>
      </footer>
    </div>
  )
}
