import H5Card from '@/components/H5Card'
import AdPlacement from '@/components/AdPlacement'
import h5Pages from '@/config/h5-pages'

export default function H5Page() {
  const categories = [...new Set(h5Pages.map((p) => p.category))]

  return (
    <div>
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-2xl font-bold text-zinc-900">📱 热门 H5 网页</h1>
          <p className="mt-2 text-sm text-zinc-500">
            精选优质 H5 小游戏、实用在线工具和创意网页，点击即可体验
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        {categories.map((category) => {
          const categoryPages = h5Pages.filter((p) => p.category === category)
          return (
            <div key={category} className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-zinc-800">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryPages.map((page) => (
                  <H5Card key={page.id} page={page} />
                ))}
              </div>
            </div>
          )
        })}

        <AdPlacement module="h5" />
      </section>
    </div>
  )
}