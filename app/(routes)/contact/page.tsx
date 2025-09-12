import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

const Contact = () => {
  return (
    <>
    <section className="bg-slate-100">
      <div className="container mx-auto pt-10 pb-40">
          <h2 className="text-3xl font-bold mb-5">GET <span className="text-[#0253A3]">IN TOUCH</span></h2>
          <div className="grid grid-cols-4 gap-5">
          <Card className="p-5">
            <h3 className="font-bold text-xl">Registered Office</h3>
            <div>
              <p>+88-01842-007653</p>
              <p>info@kbtexpress.net</p>
              <p>Plot # 34, HM Plaza, Floor # 7, Room# 703, Sector # 03, Uttara, Dhaka-1230, Bangladesh</p>  
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-xl">Corporate Office</h3>
            <div>
              <p>+88-01842-007653</p>
              <p>info@kbtexpress.net</p>
              <p>House # 04, Floor # 7, Road # 11, Sector #01, Uttara, Dhaka-1230, Bangladesh</p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-xl">Chittagong Office</h3>
            <div>
              <p>+88-01842-007653</p>
              <p>info@kbtexpress.net</p>
              <p>Sabbir Chamber (3rdFloor), 60, AgrabadC/A, Chittagong, Bangladesh</p>
            </div>
          </Card>
          <Card className="p-5 shadow-md">
            <h3 className="font-bold text-xl">Khulna Office</h3>
            <div>
              <p>+88-01842-007653</p>
              <p>info@kbtexpress.net</p>
              <p>House # 98, Ward # 9, City Bypass Road, KMP, Khulna, Banaldesh</p>
            </div>
          </Card>
          <Card className="p-5 shadow-md">
            <h3 className="font-bold text-xl mb-2">Rajshahi (Rooppur) Office</h3>
            <div>
              <p>+88-01842-007653</p>
              <p>info@kbtexpress.net</p>
              <p>Diar Baghoil, Post: Diar Shahapur-6620, Ishwardi, Pabna, Bangladesh</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
    <section className="mt-10 mb-40">
            <form className="container mx-auto">
              <p className="text-orange-500 font-medium">CONTACT WITH US</p>
              <h2 className="text-3xl font-bold mb-5">WE WANT TO<span className="text-[#0253A3]"> HEAR FROM YOU</span></h2>
              <div className="max-w-4xl grid grid-cols-2 gap-5">
                <Input className="border-slate-300" placeholder="Name" type="text" />
                <Input className="border-slate-300" placeholder="Email" type="email" />
                <Input className="border-slate-300" placeholder="Mobile Number" type="text" />
                <Input className="border-slate-300" placeholder="Subject" type="text"/>
                <Input className="border-slate-300" placeholder="Pick Up Post Code" type="text"/>
                <Input className="border-slate-300" placeholder="Delivery Location" type="text"/>
                <Textarea className="border-slate-300 col-span-2"  placeholder="Message" name="message" id="message" />
              </div>
              <button className="bg-orange-400 hover:bg-orange-500 w-40 text-white p-2 font-semibold rounded-md mt-2 uppercase text-base cursor-pointer" type="button"><span>Send Message</span></button>
            </form>
        </section>
    </>
  )
}

export default Contact