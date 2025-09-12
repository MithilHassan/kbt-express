export const Testimonials = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {["Fast & reliable!", "Excellent support team.", "Highly recommend DTD!"]
          .map((text, i) => (
            <div key={i} className="border p-6 rounded shadow">
              <p className="italic">"{text}"</p>
              <p className="mt-2 font-bold">- Client {i + 1}</p>
            </div>
          ))}
      </div>
    </div>
  </section>
);