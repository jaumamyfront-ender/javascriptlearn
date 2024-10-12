import { ActionButton } from "components/common/buttons/actionIconButton";
import { Dialog } from "components/dialog/dialogBase/dialog";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import pl from "i18n-iso-countries/langs/pl.json";
import { CompanyGetOrdersResponseItem } from "models/api/companyGetOrdersResponseItem";
import { OrderStatusEnum } from "models/api/orderStatusEnum";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import "twin.macro";
import tw from "twin.macro";
import { localeDate, numberWithSpaces } from "utils/renderHelpers";
/** @jsxImportSource @emotion/react */

interface ProductDetailProps {
  detailsInfo: CompanyGetOrdersResponseItem;
  number?: string;
}

const ProductDetail = ({
  detailsInfo: {
    addedAt,
    address,
    items,
    status,
    currency,
    stripeId,
    addressInvoice,
    inPostName,
    inPostAddress1,
    inPostAddress2,
    totalOrderSum,
  },
  number,
}: ProductDetailProps) => {
  const { t } = useTranslation("product");
  const { t: tCommon } = useTranslation("common");

  countries.registerLocale(en);
  countries.registerLocale(pl);

  const countryObj = countries.getNames(
    localStorage.getItem("i18nextLng") || "pl",
    {
      select: "official",
    }
  );
  // const tempPriceArray: number[] = []

  // items?.forEach(
  //   ({ orderItems }) =>
  //     orderItems?.forEach(
  //       ({ priceTotal }) => typeof priceTotal == 'number' && tempPriceArray.push(priceTotal)
  //     )
  // )
  // const priceTotalPay = tempPriceArray.reduce((acc, num) => acc + num, 0)

  return (
    <Dialog
      title={
        <>
          {t("titleOrder")}{" "}
          <span tw="lowercase">{tCommon("labels.numberShort")}</span> {number}
        </>
      }
      trigger={<ActionButton details />}
    >
      <div>
        <div tw="px-6 py-4 border-b border-gray-600">
          <h2 tw="mb-1 text-gray-200 text-2xs">{t("itemHeader.products")}</h2>
          <table>
            <tbody>
              {items?.map(({ creatorName, orderItems, comment }, index) => {
                return (
                  <Fragment key={index}>
                    {orderItems?.map(
                      ({ name, amount, isInPost, variant }, indexOrder) => {
                        return (
                          <tr
                            css={[
                              index != 0 && tw`border-t border-gray-600`,
                              tw`text-xs`,
                            ]}
                            key={indexOrder}
                          >
                            <td tw="flex flex-col py-2 w-64">
                              <span tw="font-bold">{name}</span>
                              <span tw="font-bold">
                                {variant?.values.map(
                                  ({ name: valuesName }, valuesIndex) => (
                                    <span key={valuesIndex}>
                                      {`${valuesIndex > 0 ? `,` : ""}`}{" "}
                                      {valuesName?.text}
                                    </span>
                                  )
                                )}
                              </span>
                              {creatorName && (
                                <span tw="text-gray-200">
                                  {tCommon("userType.creator")} - {creatorName}
                                </span>
                              )}
                            </td>
                            <td>
                              <span tw="ml-2 text-gray-200">
                                x{amount}
                                <span tw="ml-1">{tCommon("labels.item")}</span>
                              </span>
                            </td>

                            <td tw="flex flex-col items-start ml-10 gap-2">
                              <div>
                                <p tw="text-gray-200 text-2xs">
                                  {t("deliveryMethod")}:
                                </p>
                                <p tw="text-2xs">
                                  {isInPost
                                    ? t("deliveryParcelInPost") +
                                      " " +
                                      inPostName +
                                      " " +
                                      inPostAddress1 +
                                      " " +
                                      inPostAddress2
                                    : t("deliveryCourier")}
                                </p>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                    {!!comment && (
                      <tr>
                        <td />
                        <td />

                        <td
                          css={[
                            index != items.length - 1 && tw` pb-2`,
                            tw`flex flex-col items-start ml-10 gap-2`,
                          ]}
                        >
                          <div>
                            <p tw="text-gray-200 text-2xs w-fit">
                              {t("commentsToOrder")}:
                            </p>
                            <p tw="text-2xs w-fit">{comment}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div tw="px-6 py-4 border-b border-gray-600">
          <table tw="w-full text-xs">
            <tbody>
              <tr tw="">
                <td tw="flex flex-col w-1/3">
                  <p tw="text-gray-200 text-2xs">{t("itemHeader.buyer")}</p>
                  <p tw="text-2xs">
                    <span tw="whitespace-nowrap">
                      {address?.firstName}
                      {` `}
                      {address?.lastName}
                    </span>
                  </p>
                </td>
                <td tw="w-1/3">
                  <p tw="text-2xs text-gray-200">{t("itemHeader.purchased")}</p>
                  <p tw="text-2xs">{localeDate(addedAt)}</p>
                </td>
                <td tw="text-2xs w-1/3">
                  <p tw="text-2xs text-gray-200">{t("itemHeader.payment")}</p>
                  <p tw="text-2xs">
                    {t(`orderStatusEnum.${status as OrderStatusEnum}`)}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <div tw="mt-2 flex flex-row">
            <div tw="w-1/3">
              <p tw="text-2xs text-gray-200">{t("totalAmount")}:</p>
              <p tw="text-2xs">
                {numberWithSpaces(totalOrderSum, true)}
                <span tw="uppercase ml-1">{currency}</span>
              </p>
            </div>
            <div tw="w-4/6">
              <p tw="text-2xs text-gray-200">{t("StripeID")}:</p>
              <p tw="break-words text-2xs">{stripeId}</p>
            </div>
          </div>
        </div>
        <div tw="px-6 py-4">
          <table tw="w-full text-xs">
            <tbody>
              <tr tw="">
                <td tw="w-1/3 text-2xs">
                  <p tw="text-2xs text-gray-200 w-full">
                    {t("recipientsDetails")}:
                  </p>
                  <p tw="text-2xs">
                    <span>{address?.firstName}</span>
                    <span tw="ml-1">{address?.lastName}</span>
                  </p>
                  <p tw="text-2xs">{address?.address}</p>
                  <p tw="">
                    <span>{address?.postalAddress}</span>
                    <span tw="ml-1">{address?.city}</span>
                  </p>
                  <p tw="text-2xs">
                    {countryObj[`${address?.country.toUpperCase()}`]}
                  </p>
                  <p tw="text-2xs">
                    <span>{address?.phoneCode}</span>
                    <span tw="ml-1">{address?.phoneNumber}</span>
                  </p>
                  <p tw="text-2xs">{address?.email}</p>
                </td>

                {!!addressInvoice && (
                  <td tw="text-2xs w-2/3 flex flex-col items-start">
                    <p tw="text-2xs text-gray-200">{t("invoiceData")}:</p>

                    <div>
                      <p>{addressInvoice?.name}</p>
                      <p>{addressInvoice?.address}</p>
                      <p>
                        {addressInvoice?.postalAddress},{` `}
                        {addressInvoice?.city}
                      </p>
                      <p>
                        {countryObj[`${addressInvoice?.country.toUpperCase()}`]}
                      </p>
                      <p>{addressInvoice?.tin}</p>
                    </div>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Dialog>
  );
};

export { ProductDetail };
<div tw="px-6 py-4 border-b border-gray-600 [&_h1]:text-white  [&_h1]:font-bold  [&_h1]:text-xl  [&_h1]:mb-4  [&_h2]:text-gray-200 [&_h2]:text-xs [&_p]:text-xs  [&_p]:font-semibold "></div>;
