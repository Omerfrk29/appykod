'use client';

import { ArrowRight, Workflow, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  image: string;
  gradient: string;
}

const products: Product[] = [
  {
    id: 'appyflow',
    name: 'AppyFlow',
    icon: <Workflow className="w-6 h-6" />,
    description:
      'A powerful workflow automation tool designed to streamline your business operations and increase efficiency by up to 40%.',
    features: ['Drag & Drop Builder', 'API Integrations', 'Real-time Analytics'],
    image: '/images/appyflow-dashboard.png',
    gradient: 'from-accent-primary/20 to-accent-secondary/20',
  },
  {
    id: 'kodsecure',
    name: 'KodSecure',
    icon: <Shield className="w-6 h-6" />,
    description:
      'Enterprise-grade security software protecting your digital assets with real-time threat detection and AI-driven defense mechanisms.',
    features: ['Threat Detection', 'Encryption', '24/7 Monitoring'],
    image: '/images/kodsecure-shield.png',
    gradient: 'from-accent-primary/20 to-accent-secondary/20',
  },
];

export default function FeaturedProducts() {
  const { t } = useLanguage();

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-secondary rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Products
            </h2>
          </div>
        </div>

        {/* Products */}
        <div className="space-y-16">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 lg:gap-16 items-center`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    {product.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </h3>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {product.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <button className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all group">
                  View Product
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Image/Visual */}
              <div className="flex-1 w-full">
                <div
                  className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${product.gradient} p-8 aspect-video`}
                >
                  {product.id === 'appyflow' ? (
                    // AppyFlow Dashboard Mockup
                    <div className="bg-white rounded-2xl shadow-2xl p-4 h-full">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                        <span className="ml-2 text-xs text-gray-400">
                          AppyFlow Dashboard
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 h-[calc(100%-2rem)]">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-2">
                            Active Workflows
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            24
                          </div>
                          <div className="mt-4 space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="h-2 bg-secondary/30 rounded"
                                style={{ width: `${100 - i * 20}%` }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="col-span-2 bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-2">
                            Performance
                          </div>
                          <div className="flex items-end gap-1 h-[calc(100%-1.5rem)]">
                            {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-secondary/60 rounded-t"
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // KodSecure Shield Visual
                    <div className="flex items-center justify-center h-full">
                      <div className="relative">
                        <div className="absolute inset-0 bg-accent-primary/30 rounded-full blur-3xl animate-pulse" />
                        <Shield className="w-32 h-32 text-accent-primary relative z-10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-40 h-40 border-2 border-accent-primary/30 rounded-full animate-ping" />
                        </div>
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
