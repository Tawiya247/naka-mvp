import { useCallback, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { BookingSheet } from './components/BookingSheet';
import { RechargeSheet } from './components/RechargeSheet';
import { Toast } from './components/Toast';
import { TripTracker } from './components/TripTracker';
import { ActivityScreen } from './screens/Activity';
import { HomeScreen } from './screens/Home';
import { ImpactScreen } from './screens/Impact';
import { MapScreen } from './screens/Map';
import { PartnerScreen } from './screens/Partner';
import { ProfileScreen } from './screens/Profile';
import { useNaka } from './store';
import type { Order, Place, Service, Tab, Vehicle } from './types';

export interface BookingRequest {
  kind: 'trajet' | 'colis';
  vehicle?: Vehicle;
  service?: Service;
  destination: Place | null;
}

export interface Trip {
  request: BookingRequest;
  destination: Place;
  price: number;
  co2: number;
  station: string;
}

export function App() {
  const { placeOrder, message, clearMessage } = useNaka();
  const [tab, setTab] = useState<Tab>('home');
  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [partner, setPartner] = useState(false);

  const startVehicle = useCallback((vehicle: Vehicle, destination: Place | null) => {
    setBooking({ kind: 'trajet', vehicle, destination });
  }, []);

  const startService = useCallback((service: Service, destination: Place | null) => {
    setBooking({ kind: 'colis', service, destination });
  }, []);

  const finishTrip = useCallback(
    (target: Tab) => {
      if (!trip) return;
      const order: Omit<Order, 'id' | 'date'> = {
        kind: trip.request.kind,
        label: trip.request.vehicle?.name ?? trip.request.service?.name ?? 'Course NAKA',
        to: trip.destination.label,
        price: trip.price,
        co2SavedG: trip.co2,
        station: trip.station,
        solar: true,
      };
      placeOrder(order);
      setTrip(null);
      setTab(target);
    },
    [placeOrder, trip],
  );

  const goHome = useCallback(() => setTab('home'), []);

  let content;
  if (partner) {
    content = (
      <PartnerScreen
        onBack={() => setPartner(false)}
        onFindBattery={() => {
          setPartner(false);
          setTab('map');
        }}
      />
    );
  } else if (tab === 'home') {
    content = (
      <HomeScreen
        onBook={startVehicle}
        onOrderService={startService}
        onOpenRecharge={() => setRechargeOpen(true)}
        onOpenProfile={() => setTab('profile')}
        onOpenImpact={() => setTab('impact')}
        onOpenMap={() => setTab('map')}
      />
    );
  } else if (tab === 'map') {
    content = <MapScreen />;
  } else if (tab === 'activity') {
    content = <ActivityScreen onGoHome={goHome} />;
  } else if (tab === 'impact') {
    content = <ImpactScreen onGoHome={goHome} />;
  } else {
    content = (
      <ProfileScreen
        onOpenActivity={() => setTab('activity')}
        onOpenRecharge={() => setRechargeOpen(true)}
        onOpenPartner={() => setPartner(true)}
      />
    );
  }

  return (
    <div className="frame">
      <div className="app">
        <div className="app-scroll" key={partner ? 'partner' : tab}>
          {content}
        </div>

        <BottomNav
          active={tab}
          onChange={(next) => {
            setPartner(false);
            setTab(next);
          }}
        />

        <Toast message={message} onDone={clearMessage} />

        {booking ? (
          <BookingSheet
            key={`${booking.kind}-${booking.vehicle?.id ?? booking.service?.id ?? 'x'}`}
            request={booking}
            onClose={() => setBooking(null)}
            onConfirm={(nextTrip) => {
              setBooking(null);
              setTrip(nextTrip);
            }}
          />
        ) : null}

        {rechargeOpen ? <RechargeSheet onClose={() => setRechargeOpen(false)} /> : null}

        {trip ? <TripTracker trip={trip} onFinish={finishTrip} /> : null}
      </div>
    </div>
  );
}
