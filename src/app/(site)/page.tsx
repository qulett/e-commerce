import Container from '~/core/ui/Container';
import Divider from '~/core/ui/Divider';
import Heading from '~/core/ui/Heading';
import SubHeading from '~/core/ui/SubHeading';
import PricingTable from '~/components/PricingTable';
import CarouselSection from './components/CarouselSection';
import Button from '~/core/ui/Button';
import { ChevronRight } from 'lucide-react';
import { ScrollArea, ScrollBar } from '~/core/ui/scroll-area';

export default function Home() {
  return (
    <div className={'flex flex-col space-y-16'}>
      <Container>
        <div className="mt-4">
          <CarouselSection />
        </div>
      </Container>

      <Container>
        <div className="flex flex-row justify-between">
          <Heading type={3}>Shop by Categories</Heading>
          <Button variant={'link'}>
            View All
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-center">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-lg shadow-lg flex flex-col space-y-2 bg-white"
            >
              <div className="bg-black h-24">Image</div>
              <div className="font-bold text-center">True Wireless Earbuds</div>
            </div>
          ))}
        </div>
      </Container>

      <Container>
        <div className="flex flex-row justify-between">
          <Heading type={3}>Explore Bestsellers</Heading>
          <Button variant={'link'}>
            View All
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
        <ScrollArea className="w-full">
          <div className="flex flex-row gap-4 p-4 ">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index}>
                <div className="p-4 rounded-lg shadow-lg flex flex-col space-y-2">
                  <div className="bg-black h-60 w-60">Image</div>
                  <div className="font-bold text-center">Wireless Earbuds</div>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Container>

      <Divider />

      <Container>
        <div
          className={
            'flex flex-col items-center justify-center py-16 space-y-16'
          }
        >
          <div className={'flex flex-col items-center space-y-8 text-center'}>
            <div className={'flex flex-col space-y-2.5'}>
              <Heading type={2}>
                Ready to take your SaaS business to the next level?
              </Heading>

              <SubHeading as={'h3'}>
                Get started on our free plan and upgrade when you are ready.
              </SubHeading>
            </div>
          </div>

          <div className={'w-full'}>
            <PricingTable />
          </div>
        </div>
      </Container>
    </div>
  );
}
