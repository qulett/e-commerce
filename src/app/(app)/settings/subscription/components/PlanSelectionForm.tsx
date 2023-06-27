'use client';

import If from '~/core/ui/If';
import PricingTable from '~/components/PricingTable';
import CheckoutRedirectButton from '~/app/(app)/settings/subscription/components/CheckoutRedirectButton';
import BillingPortalRedirectButton from '~/app/(app)/settings/subscription/components/BillingRedirectButton';

const PlanSelectionForm: React.FCC<{
  customerId: Maybe<string>;
}> = ({ customerId }) => {
  return (
    <div className={'flex flex-col space-y-6'}>
      <div className={'flex w-full flex-col space-y-8'}>
        <PricingTable
          CheckoutButton={(props) => {
            return (
              <CheckoutRedirectButton
                customerId={customerId}
                stripePriceId={props.stripePriceId}
                recommended={props.recommended}
              >
                Checkout
              </CheckoutRedirectButton>
            );
          }}
        />

        <If condition={customerId}>
          <div className={'flex flex-col space-y-2'}>
            <BillingPortalRedirectButton customerId={customerId as string}>
              Manage Billing
            </BillingPortalRedirectButton>

            <span className={'text-xs text-gray-500 dark:text-gray-400'}>
              Visit your Customer Portal to manage your subscription and billing
            </span>
          </div>
        </If>
      </div>
    </div>
  );
};

export default PlanSelectionForm;
