import { getAllSettings } from '@/lib/queries';
import SettingsForm from './SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await getAllSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Nastavitve</h1>
        <p className="text-ink-soft">
          Uredi vsa besedila na spletni strani — naslov, podnaslov, kontakt, bonus banner...
        </p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
