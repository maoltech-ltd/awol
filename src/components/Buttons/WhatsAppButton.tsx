

export default function WhatsAppButton({ message }: { message: string }) {
  const phone = "2348059184927"; 

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      className="block w-full text-center py-3 rounded-xl bg-green-600 text-white font-semibold"
    >
      WhatsApp Us
    </a>
  );
}