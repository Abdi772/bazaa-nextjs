 'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

import { modelsFor } from '../../lib/models';
import { cleanSpecs, DEFAULT_PHONE_SPECS, hasSpecs, type SpecRow } from '../../lib/specs';
import SpecsEditor from '../SpecsEditor';
import { supabase } from '../../lib/supabaseClient';
import {
  CATEGORY_CONFIG,
  ETHIOPIA_REGIONS,
  CONDITIONS,
  getModels,
  getOtherBrands,
} from '../../lib/categories';
import { listingSlug } from '../../lib/listings';
import { compressImage } from '../../lib/compressImage';

const MAX_PHOTOS = 5;

const inputClass =
  'w-full min-h-[48px] rounded-bazaa border border-line bg-surface px-4 py-3 text-base text-fg placeholder:text-mutedLight transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20';

const labelClass =
  'mb-1.5 block text-sm font-bold text-fg';

export default function PostPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [autoTitle, setAutoTitle] = useState('');
  const [year, setYear] = useState('');
  const [trim, setTrim] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [sizeSqm, setSizeSqm] = useState('');
  const [furnished, setFurnished] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [condition, setCondition] = useState(
    CONDITIONS[0],
  );
  const [region, setRegion] = useState(
    ETHIOPIA_REGIONS[0],
  );
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [specs, setSpecs] = useState<SpecRow[]>(DEFAULT_PHONE_SPECS);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);

      if (data.user?.email) {
        setEmail(data.user.email);
      }

      setReady(true);
    });
  }, []);

  const subcategories = Object.keys(
    CATEGORY_CONFIG[category]?.subcategories ?? {},
  );

  const mainBrands = subcategory
    ? CATEGORY_CONFIG[category]?.subcategories[
        subcategory
      ] ?? []
    : [];

  // Main brands first, then the brands that sit under "Other"
  const extraBrands = subcategory
    ? getOtherBrands(subcategory)
    : [];

  const brands =
    extraBrands.length > 0
      ? Array.from(
          new Set([
            ...mainBrands.filter((b) => b !== 'Other'),
            ...extraBrands.filter((b) => b !== 'Other'),
            'Other',
          ]),
        )
      : mainBrands;

  const brandLabel =
    [
      'Accessories',
      'Phone Accessories',
      'Audio',
      'Networking',
      'Security & CCTV',
    ].includes(subcategory)
      ? 'Type'
      : 'Brand';

  const modelLabel =
    subcategory === 'TV'
      ? 'Size'
      : subcategory === 'Refrigerators & Freezers'
        ? 'Type'
        : 'Model';

  // TV (sizes) and Refrigerators & Freezers (types) do not depend on brand
  const needsBrand =
    subcategory !== 'TV' && subcategory !== 'Refrigerators & Freezers';

  const builtInModels =
    subcategory && (brand || !needsBrand)
      ? getModels(subcategory, brand)
      : [];

  const modelList =
    builtInModels.length > 0
      ? builtInModels
      : modelsFor(subcategory, brand);

  const shownModels = (() => {
    const clean = (v: string) =>
      v.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const q = clean(modelSearch);

    if (!q) return modelList;

    return modelList.filter(
      (m) => m === model || clean(m).includes(q),
    );
  })();

  function onCategoryChange(value: string) {
    setCategory(value);
    setSubcategory('');
    setBrand('');
    setModel('');
  }

  // Vehicles also get Year and Trim
  const isVehicle =
    category === 'Vehicles' ||
    [
    'Cars',
    'Pickup Trucks',
    'Vans & Minivans',
    'Minibuses',
    'Buses',
    'Trucks',
    'Motorcycles',
    'Three-Wheelers',
  ].includes(subcategory);

  // Model number is shown for Electronics (phones, laptops, appliances...)
  const showModelNumber =
    !!subcategory &&
    category === 'Electronics' &&
    modelLabel === 'Model';

  // Property fields
  const isHome =
    subcategory === 'For Rent' || subcategory === 'For Sale';
  const showSize =
    isHome ||
    subcategory === 'Land' ||
    subcategory === 'Commercial';

  const yearOptions = Array.from(
    { length: new Date().getFullYear() + 1 - 1979 },
    (_, i) => String(new Date().getFullYear() + 1 - i),
  );

  const manualLabel =
    modelLabel === 'Model' ? 'Model name' : modelLabel;

  function onCustomModelChange(value: string) {
    setCustomModel(value);

    // keep the title in step while the seller types the model
    if (
      value.trim() &&
      (!title.trim() || title === autoTitle)
    ) {
      const next = suggestTitle(brand, value.trim());
      setTitle(next);
      setAutoTitle(next);
    }
  }

  // "Samsung" + "Galaxy S24" -> "Samsung Galaxy S24"
  // "iPhone" + "iPhone 15" -> "iPhone 15"
  function suggestTitle(b: string, m: string) {
    const startsWithBrand = m
      .toLowerCase()
      .startsWith(b.toLowerCase());

    const base = startsWithBrand ? m : `${b} ${m}`.trim();

    return subcategory === 'TV' ? `${base} TV` : base;
  }

  function onModelPicked(value: string) {
    setModel(value);
    setCustomModel('');
    setModelNumber('');

    if (!value || value === 'Other') return;

    // Only fill the title if it is empty or still our own suggestion
    if (!title.trim() || title === autoTitle) {
      const next = suggestTitle(brand, value);
      setTitle(next);
      setAutoTitle(next);
    }
  }

  function onSubcategoryChange(value: string) {
    setSubcategory(value);
    setBedrooms('');
    setBathrooms('');
    setSizeSqm('');
    setFurnished('');
    setYear('');
    setTrim('');
    setBrand('');
    setModel('');
    setCustomModel('');
    setModelNumber('');
    setModelSearch('');
  }

  function onFilesChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const picked = Array.from(e.target.files ?? []);

    if (picked.length > MAX_PHOTOS) {
      setError(
        `You can add up to ${MAX_PHOTOS} photos. The first ${MAX_PHOTOS} will be used.`,
      );
    } else {
      setError('');
    }

    setFiles(picked.slice(0, MAX_PHOTOS));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) return;

    if (files.length === 0) {
      setError('Please add at least one photo.');
      return;
    }

    setBusy(true);
    setError('');

    const imageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setStatus(
        `Uploading photo ${i + 1} of ${files.length}...`,
      );

      const file = await compressImage(files[i]);
      const ext =
        file.name.split('.').pop() || 'jpg';

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { error: uploadError } =
        await supabase.storage
          .from('listing-images')
          .upload(fileName, file);

      if (uploadError) {
        setError(
          `Could not upload photo ${i + 1}: ${uploadError.message}`,
        );
        setBusy(false);
        setStatus('');
        return;
      }

      const { data: urlData } =
        supabase.storage
          .from('listing-images')
          .getPublicUrl(fileName);

      imageUrls.push(urlData.publicUrl);
    }

    setStatus('Publishing...');

    const finalModel =
      model === 'Other' && customModel.trim()
        ? customModel.trim()
        : model.trim();

    const { data, error: insertError } =
      await supabase
        .from('listings')
        .insert({
          title: title.trim(),
          price: Number(price),
          category,
          subcategory: subcategory || null,
          brand: brand || null,
          model: finalModel || null,
          model_number:
            showModelNumber && modelNumber.trim()
              ? modelNumber.trim()
              : null,
          model_custom:
            modelList.length > 0 &&
            model === 'Other' &&
            !!customModel.trim(),
          year: isVehicle && year ? Number(year) : null,
          trim: isVehicle && trim.trim() ? trim.trim() : null,
          bedrooms: isHome && bedrooms ? Number(bedrooms) : null,
          bathrooms: isHome && bathrooms ? Number(bathrooms) : null,
          size_sqm: showSize && sizeSqm ? Number(sizeSqm) : null,
          furnished: isHome && furnished ? furnished : null,
          condition,
          region,
          location: location.trim(),
          description: description.trim(),
          specs: hasSpecs(subcategory) ? cleanSpecs(specs) : null,
          email: email.trim(),
          phone: phone.trim(),
          image_url: imageUrls[0] ?? null,
          image_urls: imageUrls,
          user_id: user.id,
        })
        .select('id, title')
        .single();

    if (insertError || !data) {
      setError(
        insertError?.message ??
          'Something went wrong saving your listing.',
      );
      setBusy(false);
      setStatus('');
      return;
    }

    router.push(
      `/products/${listingSlug(data)}`,
    );
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="text-sm font-medium text-muted">
          Loading...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-6 sm:py-12">
        <div className="bazaa-card p-5 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amberSoft text-amberText">
            <span className="text-xl">+</span>
          </div>

          <h1 className="bazaa-title text-2xl">
            Log in to post a listing
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Use the Log in / Sign up button at the
            top of the page, then come back here.
          </p>

          <a
            href="/"
            className="bazaa-primary mt-6 min-h-[48px] w-full px-5 sm:w-auto"
          >
            Back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-1 sm:py-4">
      <div className="mb-5 sm:mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-amberText sm:text-sm">
          Sell on Bazaa
        </p>

        <h1 className="bazaa-title mt-1 text-[28px] leading-tight sm:text-4xl">
          Post a listing
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          Add the details below to create your
          marketplace listing.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 sm:space-y-5"
      >
        <section className="bazaa-card p-4 sm:p-6">
          <div className="mb-4 sm:mb-5">
            <h2 className="font-serif text-xl font-bold text-fg">
              Photos
            </h2>

            <p className="mt-1 text-sm leading-5 text-muted">
              Add up to {MAX_PHOTOS} clear photos.
              The first photo will be used as the
              main listing image.
            </p>
          </div>

          <label
            htmlFor="listing-photos"
            className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-bazaa border border-dashed border-line bg-panel px-4 py-7 text-center transition-colors hover:border-amber hover:bg-amberSoft active:bg-amberSoft sm:min-h-[170px]"
          >
            <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amberSoft text-2xl font-bold text-amberText">
              +
            </span>

            <span className="font-bold text-fg">
              Choose photos
            </span>

            <span className="mt-1 text-xs text-muted">
              JPG, PNG or other image formats
            </span>

            <input
              id="listing-photos"
              type="file"
              accept="image/*"
              multiple
              onChange={onFilesChange}
              className="sr-only"
            />
          </label>

          {files.length > 0 && (
            <div className="mt-3 rounded-bazaa border border-amber/20 bg-amberSoft px-4 py-3 text-sm text-fg">
              <span className="font-bold">
                {files.length} photo
                {files.length === 1 ? '' : 's'}
              </span>{' '}
              selected
            </div>
          )}
        </section>

        <section className="bazaa-card p-4 sm:p-6">
          <div className="mb-4 sm:mb-5">
            <h2 className="font-serif text-xl font-bold text-fg">
              Basic details
            </h2>

            <p className="mt-1 text-sm leading-5 text-muted">
              Tell buyers what you're selling.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="listing-category"
                className={labelClass}
              >
                Category
              </label>

              <select
                id="listing-category"
                className={inputClass}
                value={category}
                onChange={(e) =>
                  onCategoryChange(
                    e.target.value,
                  )
                }
              >
                {Object.keys(
                  CATEGORY_CONFIG,
                ).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {subcategories.length > 0 && (
              <div>
                <label
                  htmlFor="listing-subcategory"
                  className={labelClass}
                >
                  Subcategory
                </label>

                <select
                  id="listing-subcategory"
                  className={inputClass}
                  required
                  value={subcategory}
                  onChange={(e) =>
                    onSubcategoryChange(
                      e.target.value,
                    )
                  }
                >
                  <option value="">
                    Select...
                  </option>

                  {subcategories.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {brands.length > 0 && (
              <div>
                <label
                  htmlFor="listing-brand"
                  className={labelClass}
                >
                  {brandLabel}
                </label>

                <select
                  id="listing-brand"
                  className={inputClass}
                  required
                  value={brand}
                  onChange={(e) => {
                    setBrand(
                      e.target.value,
                    );
                    setModel('');
                    setCustomModel('');
      setModelNumber('');
                    setModelSearch('');
                  }}
                >
                  <option value="">
                    Select...
                  </option>

                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {subcategory && category !== 'Property' && (
              <div>
                <label
                  htmlFor="listing-model"
                  className={labelClass}
                >
                  {modelLabel}
                </label>

                {modelList.length > 0 ? (
                  <>
                    {modelList.length > 15 && (
                      <input
                        type="search"
                        className={`${inputClass} mb-2`}
                        value={modelSearch}
                        onChange={(e) =>
                          setModelSearch(e.target.value)
                        }
                        placeholder={`Search ${modelLabel.toLowerCase()}...`}
                      />
                    )}

                    <select
                      id="listing-model"
                      className={inputClass}
                      required
                      value={model}
                      onChange={(e) =>
                        onModelPicked(e.target.value)
                      }
                    >
                      <option value="">
                        Select {modelLabel.toLowerCase()}...
                      </option>

                      {shownModels.map((m) => (
                        <option key={m} value={m}>
                          {m === 'Other'
                            ? `Can't find my ${modelLabel.toLowerCase()} - enter it manually`
                            : m}
                        </option>
                      ))}
                    </select>

                    {model === 'Other' && (
                      <div className="mt-2 rounded-bazaa border border-line bg-surfaceSoft p-3">
                        <p className="mb-2 text-sm font-semibold text-fg">
                          Can't find your {modelLabel.toLowerCase()}? Enter it here.
                        </p>
                        <label className={labelClass}>
                          {manualLabel}
                        </label>
                        <input
                          required
                          className={inputClass}
                          value={customModel}
                          onChange={(e) => onCustomModelChange(e.target.value)}
                          placeholder="Type it here"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <input
                    id="listing-model"
                    className={inputClass}
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Model name (optional)"
                  />
                )}
               </div>
            )}

            {showModelNumber && (
              <div>
                <label
                  htmlFor="listing-model-number"
                  className={labelClass}
                >
                  Model number
                </label>
                <input
                  id="listing-model-number"
                  className={inputClass}
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  placeholder="e.g. SM-A576B (optional)"
                  autoComplete="off"
                />
              </div>
            )}

            {isHome && (
              <>
                <div>
                                     <label htmlFor="listing-bedrooms" className={labelClass}>
                    Bedrooms
                  </label>
                  <input
                    id="listing-bedrooms"
                    className={inputClass}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="e.g. 3 (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="listing-bathrooms" className={labelClass}>
                    Bathrooms
                  </label>
                  <input
                    id="listing-bathrooms"
                    className={inputClass}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    placeholder="e.g. 2 (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="listing-furnished" className={labelClass}>
                    Furnished
                  </label>
                  <select
                    id="listing-furnished"
                    className={inputClass}
                    value={furnished}
                    onChange={(e) => setFurnished(e.target.value)}
                  >
                    <option value="">Select (optional)</option>
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-furnished">Semi-furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </>
            )}

            {showSize && (
              <div>
                <label htmlFor="listing-size" className={labelClass}>
                  Size (m²)
                </label>
                <input
                  id="listing-size"
                  className={inputClass}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={sizeSqm}
                  onChange={(e) => setSizeSqm(e.target.value)}
                  placeholder="e.g. 120 (optional)"
                />
              </div>
            )}

            {isVehicle && (
              <>
                <div>
                  <label htmlFor="listing-year" className={labelClass}>
                    Year
                  </label>
                  <select
                    id="listing-year"
                    className={inputClass}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    
                  >
                    <option value="">Select year (optional)</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="listing-trim" className={labelClass}>
                    Trim / Variant
                  </label>
                  <input
                    id="listing-trim"
                    className={inputClass}
                    value={trim}
                    onChange={(e) => setTrim(e.target.value)}
                    placeholder="e.g. XLi, GLS, 4x4 (optional)"
                    autoComplete="off"
                    
                  />
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="listing-title"
                className={labelClass}
              >
                Title
              </label>

              <input
                id="listing-title"
                className={inputClass}
                required
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="e.g. iPhone 13 Pro, 128GB"
              />
            </div>

            <div>
              <label
                htmlFor="listing-price"
                className={labelClass}
              >
                Price (ETB)
              </label>

              <input
                id="listing-price"
                className={inputClass}
                type="number"
                inputMode="numeric"
                min="0"
                required
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                placeholder="e.g. 45000"
              />
            </div>

            <div>
              <label
                htmlFor="listing-condition"
                className={labelClass}
              >
                Condition
              </label>

              <select
                id="listing-condition"
                className={inputClass}
                value={condition}
                onChange={(e) =>
                  setCondition(
                    e.target.value,
                  )
                }
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="bazaa-card p-4 sm:p-6">
          <div className="mb-4 sm:mb-5">
            <h2 className="font-serif text-xl font-bold text-fg">
              Description
            </h2>

            <p className="mt-1 text-sm leading-5 text-muted">
              Give buyers the important details about
              the item.
            </p>
          </div>

          <textarea
            id="listing-description"
            className={`${inputClass} min-h-[140px] resize-y`}
            rows={5}
            required
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Condition, details, why you're selling..."
          />

          {hasSpecs(subcategory) && (
            <SpecsEditor rows={specs} onChange={setSpecs} />
          )}
        </section>

               <section className="bazaa-card p-4 sm:p-6">
          <div className="mb-4 sm:mb-5">
            <h2 className="font-serif text-xl font-bold text-fg">
              Location
            </h2>

            <p className="mt-1 text-sm leading-5 text-muted">
              Help nearby buyers find your listing.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="listing-region"
                className={labelClass}
              >
                Region
              </label>

              <select
                id="listing-region"
                className={inputClass}
                value={region}
                onChange={(e) =>
                  setRegion(e.target.value)
                }
              >
                {ETHIOPIA_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="listing-location"
                className={labelClass}
              >
                Location (city/area)
              </label>

              <input
                id="listing-location"
                className={inputClass}
                type="text"
                required
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="e.g. Jigjiga, Bole"
              />
            </div>
          </div>
        </section>

        <section className="bazaa-card p-4 sm:p-6">
          <div className="mb-4 sm:mb-5">
            <h2 className="font-serif text-xl font-bold text-fg">
              Contact details
            </h2>

            <p className="mt-1 text-sm leading-5 text-muted">
              Buyers will use these details to contact
              you.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="listing-phone"
                className={labelClass}
              >
                Phone number
              </label>

              <input
                id="listing-phone"
                className={inputClass}
                type="tel"
                inputMode="tel"
                required
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="e.g. 0911 234 567"
              />
            </div>

            <div>
              <label
                htmlFor="listing-email"
                className={labelClass}
              >
                Contact email
              </label>

              <input
                id="listing-email"
                className={inputClass}
                type="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-bazaa border border-danger/25 bg-dangerSoft p-4 text-sm font-medium leading-5 text-dangerText">
            {error}
          </div>
        )}

        {busy && status && (
          <div
            aria-live="polite"
            className="rounded-bazaa border border-line bg-surface p-4 text-sm font-medium text-muted"
          >
            {status}
          </div>
        )}

        <div className="pb-2 sm:pb-0">
          <button
            type="submit"
            disabled={busy}
            className="bazaa-primary min-h-[52px] w-full px-5 py-3.5 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy
              ? status || 'Working...'
              : 'Publish listing'}
          </button>

          <p className="mt-2 text-center text-xs leading-5 text-muted">
            Your listing will be published after the
            photos finish uploading.
          </p>
        </div>
      </form>
    </div>
  );
                }

             
