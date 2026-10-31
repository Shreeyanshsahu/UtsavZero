
type ConfirmationPageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function BookingConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { bookingId } = await params;

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold">
          Booking Confirmation
        </h1>

        <p className="text-sm text-gray-500">
          Booking ID: {bookingId}
        </p>
      </div>
    </main>
  );
}
