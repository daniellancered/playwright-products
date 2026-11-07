import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Brand from './Brand';

interface DashboardPreviewProps {
  onSignOut: () => void;
}

interface PreviewProduct {
  id: number;
  name: string;
  symbol: string;
  price: string;
  stock: number;
}

const initialProducts: PreviewProduct[] = [
  { id: 1, name: 'Studio headphones', symbol: '◈', price: '$129.00', stock: 42 },
  { id: 2, name: 'Ceramic travel mug', symbol: '◉', price: '$28.50', stock: 6 },
  { id: 3, name: 'Everyday backpack', symbol: '▧', price: '$84.00', stock: 31 },
  { id: 4, name: 'Desk lamp, matte black', symbol: '✳', price: '$56.00', stock: 0 },
  { id: 5, name: 'Glass water bottle', symbol: '◌', price: '$19.00', stock: 18 },
];

const navigation = [
  { label: 'Overview', symbol: '▦' },
  { label: 'Products', symbol: '⬡' },
  { label: 'Inventory', symbol: '⌁' },
  { label: 'Settings', symbol: '⚙' },
];

const activities = [
  {
    symbol: '＋',
    user: 'Jordan Davis',
    action: 'added',
    product: 'Studio headphones',
    time: '12 minutes ago',
  },
  { symbol: '↻', action: 'Stock updated for', product: 'Ceramic travel mug', time: '1 hour ago' },
  {
    symbol: '✓',
    action: '',
    product: 'Everyday backpack',
    suffix: 'is back in stock',
    time: 'Yesterday at 4:32 PM',
  },
  {
    symbol: '✎',
    action: 'Price changed for',
    product: 'Glass water bottle',
    time: 'Yesterday at 2:10 PM',
  },
];

export default function DashboardPreview({ onSignOut }: DashboardPreviewProps) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState('');
  const [activeSection, setActiveSection] = useState('Overview');
  const [productName, setProductName] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);
  const [notice, setNotice] = useState('');
  const noticeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (noticeTimeout.current) clearTimeout(noticeTimeout.current);
    },
    []
  );

  const filteredProducts = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [products, query]
  );

  function showNotice(text: string) {
    if (noticeTimeout.current) clearTimeout(noticeTimeout.current);
    setNotice(text);
    noticeTimeout.current = setTimeout(() => setNotice(''), 2600);
  }

  function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = productName.trim();
    if (!name) return;

    setProducts((current) => [
      { id: Date.now(), name, symbol: '＋', price: '—', stock: 0 },
      ...current,
    ]);
    setProductName('');
    setAddingProduct(false);
    showNotice(`${name} added to this preview`);
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-[4] flex h-[70px] items-center justify-between border-b border-[#222b3c] bg-[#0a0e18f0] px-[30px] backdrop-blur-[16px] max-[620px]:h-[62px] max-[620px]:px-[15px]">
        <Brand />
        <div className="flex items-center gap-[19px]">
          <span className="text-xs text-[#8d98ad] max-[620px]:hidden">
            Workspace / <strong>Overview</strong>
          </span>
          <button
            className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-[#a9a4ff] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#a7a4ff]"
            onClick={onSignOut}
            type="button"
          >
            Sign out
          </button>
          <span
            aria-label="Demo user"
            className="grid size-[34px] flex-none place-items-center rounded-full border border-[#6259f554] bg-[#6259f529] text-xs font-bold text-[#c1bdff]"
          >
            JD
          </span>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-70px)] grid-cols-[220px_minmax(0,1fr)] max-[920px]:grid-cols-[64px_minmax(0,1fr)] max-[620px]:min-h-[calc(100vh-62px)] max-[620px]:grid-cols-[52px_minmax(0,1fr)]">
        <nav
          aria-label="Main navigation"
          className="flex flex-col gap-[6px] border-r border-[#222b3c] bg-[#0b0f19] px-[14px] py-6 max-[920px]:w-16 max-[920px]:items-center max-[920px]:px-2 max-[920px]:py-[18px] max-[620px]:px-1 max-[620px]:py-[15px]"
        >
          <div className="my-[9px] mx-[10px] mb-[6px] text-[10px] font-bold uppercase tracking-[1.1px] text-[#69758b] max-[920px]:m-0 max-[920px]:h-0 max-[920px]:text-[0px]">
            Workspace
          </div>
          {navigation.slice(0, 3).map((item) => (
            <button
              aria-current={activeSection === item.label ? 'page' : undefined}
              className={`flex min-h-[42px] cursor-pointer items-center gap-[11px] rounded-lg border border-transparent bg-transparent px-[11px] text-left text-[#9da7bb] hover:bg-[#141a29] hover:text-[#e5e8f2] max-[920px]:w-11 max-[920px]:justify-center max-[920px]:px-0 max-[920px]:text-[0px] max-[620px]:w-10 ${
                activeSection === item.label
                  ? 'border-[#6259f52e] bg-[#6259f51c] font-semibold text-[#c4c0ff] hover:text-[#c4c0ff]'
                  : ''
              }`}
              key={item.label}
              onClick={() => {
                setActiveSection(item.label);
                if (item.label !== 'Overview')
                  showNotice(`${item.label} view is a preview placeholder`);
              }}
              type="button"
            >
              <span
                aria-hidden="true"
                className={`w-[17px] text-center text-[#858fa4] max-[920px]:text-[15px] ${
                  activeSection === item.label ? 'text-[#a49fff]' : ''
                }`}
              >
                {item.symbol}
              </span>
              {item.label}
            </button>
          ))}
          <div className="my-[9px] mx-[10px] mb-[6px] text-[10px] font-bold uppercase tracking-[1.1px] text-[#69758b] max-[920px]:m-0 max-[920px]:h-0 max-[920px]:text-[0px]">
            Account
          </div>
          <button
            className={`flex min-h-[42px] cursor-pointer items-center gap-[11px] rounded-lg border border-transparent bg-transparent px-[11px] text-left text-[#9da7bb] hover:bg-[#141a29] hover:text-[#e5e8f2] max-[920px]:w-11 max-[920px]:justify-center max-[920px]:px-0 max-[920px]:text-[0px] max-[620px]:w-10 ${
              activeSection === 'Settings'
                ? 'border-[#6259f52e] bg-[#6259f51c] font-semibold text-[#c4c0ff] hover:text-[#c4c0ff]'
                : ''
            }`}
            onClick={() => {
              setActiveSection('Settings');
              showNotice('Settings view is a preview placeholder');
            }}
            type="button"
          >
            <span
              aria-hidden="true"
              className={`w-[17px] text-center text-[#858fa4] max-[920px]:text-[15px] ${
                activeSection === 'Settings' ? 'text-[#a49fff]' : ''
              }`}
            >
              {navigation[3].symbol}
            </span>
            Settings
          </button>
          <div className="mt-auto flex items-center gap-[10px] border-t border-[#222b3c] px-[6px] pt-4 max-[920px]:justify-center max-[920px]:px-0">
            <span
              aria-hidden="true"
              className="grid size-[34px] flex-none place-items-center rounded-full border border-[#6259f554] bg-[#6259f529] text-xs font-bold text-[#c1bdff]"
            >
              JD
            </span>
            <span className="max-[920px]:text-[0px]">
              <strong className="block text-xs font-semibold">Jordan Davis</strong>
              <small className="block text-[11px] text-[#8d98ad]">Workspace admin</small>
            </span>
          </div>
        </nav>

        <main className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,48px)] pt-[34px] pb-[55px] max-[620px]:px-[13px] max-[620px]:pt-6 max-[620px]:pb-[45px]">
          <div className="mb-7 flex items-end justify-between gap-5 max-[620px]:mb-[18px] max-[620px]:flex-col max-[620px]:items-start">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[1.15px] text-[#a7a4ff]">
                Wednesday, November 4
              </div>
              <h1 className="my-[4px] mb-[5px] text-[28px] font-normal tracking-[-0.9px] max-[620px]:text-2xl">
                Good morning, Jordan <span aria-hidden="true">✦</span>
              </h1>
              <p className="m-0 text-[#8d98ad]">
                Here’s what’s happening with your products today.
              </p>
            </div>
            <button
              className="inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-2 rounded-[9px] border border-transparent bg-[#6259f5] px-[15px] font-semibold text-white shadow-[0_5px_16px_#5148df33] transition-all duration-[180ms] hover:-translate-y-px hover:bg-[#746cfb] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#a7a4ff]"
              onClick={() => setAddingProduct((show) => !show)}
              type="button"
            >
              <span aria-hidden="true">＋</span> Add product
            </button>
          </div>

          {addingProduct && (
            <form
              className="mb-[19px] -mt-3 flex items-center gap-[10px] rounded-[10px] border border-[#222b3c] bg-[#101522] p-3 max-[620px]:flex-col max-[620px]:items-stretch"
              onSubmit={handleAddProduct}
            >
              <label className="text-xs font-semibold text-[#dce1ed]" htmlFor="new-preview-product">
                Product name
              </label>
              <input
                autoFocus
                className="mr-auto h-[38px] w-[min(280px,100%)] rounded-[9px] border border-[#2a3346] bg-[#0e1320] px-[13px] text-sm text-[#f3f5fb] placeholder:text-[#69758b] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#a7a4ff] max-[620px]:w-full"
                id="new-preview-product"
                onChange={(event) => setProductName(event.target.value)}
                placeholder="e.g. Canvas tote bag"
                required
                value={productName}
              />
              <button
                className="inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-2 rounded-[9px] border border-transparent bg-[#6259f5] px-[15px] text-xs font-semibold text-white shadow-[0_5px_16px_#5148df33] transition-all duration-[180ms] hover:-translate-y-px hover:bg-[#746cfb] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#a7a4ff]"
                type="submit"
              >
                Add to preview
              </button>
              <button
                className="inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-2 rounded-[9px] border border-[#222b3c] bg-[#151b2a] px-[15px] text-xs font-semibold transition-all duration-[180ms] hover:border-[#3a4560] hover:bg-[#1b2334] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#a7a4ff]"
                onClick={() => setAddingProduct(false)}
                type="button"
              >
                Cancel
              </button>
            </form>
          )}

          <section
            aria-label="Inventory summary"
            className="grid grid-cols-4 gap-[14px] max-[920px]:grid-cols-2 max-[620px]:gap-[9px]"
          >
            <StatCard
              icon="▦"
              label="Total products"
              value={248 + products.length - initialProducts.length}
            >
              <span className="text-[#39c995]">↗ 12%</span> vs. last month
            </StatCard>
            <StatCard icon="$" label="Inventory value" value="$42,680">
              Across your active catalog
            </StatCard>
            <StatCard icon="!" label="Low stock" tone="amber" value="08">
              Products need a restock
            </StatCard>
            <StatCard icon="⌁" label="Out of stock" tone="red" value="03">
              Review these products
            </StatCard>
          </section>

          <div className="mt-[18px] grid grid-cols-[minmax(0,1.65fr)_minmax(245px,0.85fr)] gap-4 max-[920px]:grid-cols-1">
            <section
              aria-labelledby="inventory-title"
              className="overflow-hidden rounded-[13px] border border-[#222b3c] bg-[#101522]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#222b3c] px-[19px] py-[17px] max-[620px]:flex-col max-[620px]:items-start">
                <div>
                  <h2 className="m-0 text-sm font-semibold">Product inventory</h2>
                  <p className="mt-[3px] mb-0 text-[11px] text-[#8d98ad]">
                    Your catalog at a glance
                  </p>
                </div>
                <input
                  aria-label="Search products"
                  className="h-8 w-[150px] rounded-[7px] border border-[#293247] bg-[#0d1220] px-[10px] text-[11px] text-[#f3f5fb] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#a7a4ff] max-[620px]:w-full"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products..."
                  type="search"
                  value={query}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left whitespace-nowrap">
                  <thead>
                    <tr>
                      <th
                        className="px-[17px] py-3 text-[10px] font-semibold uppercase tracking-[0.45px] text-[#758096] max-[620px]:px-3"
                        scope="col"
                      >
                        Product
                      </th>
                      <th
                        className="px-[17px] py-3 text-[10px] font-semibold uppercase tracking-[0.45px] text-[#758096] max-[620px]:px-3"
                        scope="col"
                      >
                        Price
                      </th>
                      <th
                        className="px-[17px] py-3 text-[10px] font-semibold uppercase tracking-[0.45px] text-[#758096] max-[620px]:px-3"
                        scope="col"
                      >
                        Stock
                      </th>
                      <th
                        className="px-[17px] py-3 text-[10px] font-semibold uppercase tracking-[0.45px] text-[#758096] max-[620px]:px-3"
                        scope="col"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="border-t border-[#202839] px-[17px] py-[13px] text-xs text-[#d6dbe7] max-[620px]:px-3">
                          <span className="flex items-center gap-[10px] font-semibold">
                            <span
                              aria-hidden="true"
                              className="grid size-[30px] flex-none place-items-center rounded-[7px] border border-[#354057] bg-[#1a2233] text-xs text-[#aaa5ff]"
                            >
                              {product.symbol}
                            </span>
                            {product.name}
                          </span>
                        </td>
                        <td className="border-t border-[#202839] px-[17px] py-[13px] text-xs text-[#d6dbe7] max-[620px]:px-3">
                          {product.price}
                        </td>
                        <td className="border-t border-[#202839] px-[17px] py-[13px] text-xs text-[#d6dbe7] max-[620px]:px-3">
                          {product.stock} units
                        </td>
                        <td className="border-t border-[#202839] px-[17px] py-[13px] text-xs text-[#d6dbe7] max-[620px]:px-3">
                          <span
                            className={`inline-flex items-center gap-[5px] rounded-[20px] bg-[#39c99517] px-2 py-[3px] text-[10px] font-semibold text-[#69ddb2] before:size-[5px] before:rounded-full before:bg-current before:content-[''] ${
                              product.stock < 10 ? 'bg-[#f2b84b1a] text-[#f2c56c]' : ''
                            }`}
                          >
                            {product.stock === 0
                              ? 'Out of stock'
                              : product.stock < 10
                                ? 'Low stock'
                                : 'In stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td
                          className="border-t border-[#202839] px-[17px] py-[22px] text-center text-[#8d98ad] max-[620px]:px-3"
                          colSpan={4}
                        >
                          No products match “{query}”.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section
              aria-labelledby="activity-title"
              className="overflow-hidden rounded-[13px] border border-[#222b3c] bg-[#101522]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#222b3c] px-[19px] py-[17px] max-[620px]:flex-col max-[620px]:items-start">
                <div>
                  <h2 className="m-0 text-sm font-semibold">Recent activity</h2>
                  <p className="mt-[3px] mb-0 text-[11px] text-[#8d98ad]">
                    Latest workspace updates
                  </p>
                </div>
                <button
                  className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-[#a9a4ff] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#a7a4ff]"
                  onClick={() => showNotice('You’re viewing the latest activity')}
                  type="button"
                >
                  View all
                </button>
              </div>
              <div className="grid px-[17px] pt-1 pb-[10px]">
                {activities.map((activity) => (
                  <Activity key={activity.time} {...activity} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {notice && (
        <div
          className="fixed right-6 bottom-6 z-[8] rounded-[10px] border border-[#3b4660] bg-[#161e2e] px-4 py-3 text-[#e9ebf4] shadow-[0_10px_36px_#00000080]"
          role="status"
        >
          {notice}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  tone,
  value,
  children,
}: {
  icon: string;
  label: string;
  tone?: 'amber' | 'red';
  value: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="min-h-[132px] rounded-[13px] border border-[#222b3c] bg-[linear-gradient(145deg,#131a29,#0f1420)] p-[17px] max-[620px]:min-h-[116px] max-[620px]:p-3">
      <div className="flex items-center justify-between text-xs text-[#9ba6bb] max-[620px]:gap-1 max-[620px]:text-[10px]">
        <span>{label}</span>
        <span
          className={`grid size-[30px] place-items-center rounded-lg bg-[#6259f521] text-[#aaa5ff] ${
            tone === 'amber'
              ? 'bg-[#f2b84b1a] text-[#f2c56c]'
              : tone === 'red'
                ? 'bg-[#f071781a] text-[#f07178]'
                : ''
          }`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-[14px] text-[25px] font-bold tracking-[-0.7px] max-[620px]:text-[21px]">
        {value}
      </div>
      <div className="mt-[2px] text-[11px] text-[#768196]">{children}</div>
    </article>
  );
}

function Activity({
  symbol,
  user,
  action,
  product,
  suffix,
  time,
}: {
  symbol: string;
  user?: string;
  action: string;
  product: string;
  suffix?: string;
  time: string;
}) {
  return (
    <div className="grid grid-cols-[29px_minmax(0,1fr)] gap-[10px] py-[13px] [&+&]:border-t [&+&]:border-[#202839]">
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-lg bg-[#6259f51f] text-[#aaa5ff]"
      >
        {symbol}
      </span>
      <div>
        <p className="m-0 text-[11px] leading-[1.55] text-[#c8cedb]">
          {user && (
            <>
              <strong className="text-[#eff1f7]">{user}</strong>{' '}
            </>
          )}
          {action && `${action} `}
          <strong className="text-[#eff1f7]">{product}</strong>
          {suffix && ` ${suffix}`}
        </p>
        <time className="mt-1 block text-[10px] text-[#737f94]">{time}</time>
      </div>
    </div>
  );
}
