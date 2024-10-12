// {
//   items?.map((item) => {
//     const thumbnail =
//       item.thumbnails?.find(({ width }) => width === 'pX512')?.photoUrl ||
//       profilePhotoUrl
//     return (
//       <Link tw="block w-full" href={`/`}>
//         <div key={item.id} tw="w-full">
//           <div tw="relative aspect-square w-full">
//             <Image
//               src={thumbnail as string}
//               alt="thumbnails"
//               fill
//               className="absolute bottom-0 object-cover rounded-md"
//             />
//             {/* <img
//               src={thumbnail}
//               alt="alt"
//               className="absolute bottom-0 object-cover rounded-md"
//             /> */}
//           </div>

//           <h2 className=" mt-3 font-normal leading-none text-xl min-[320px]:text-xs max-[450px]:text-xs">
//             {item.productName}
//           </h2>
//           <p className="text-price font-bold text-lg mt-3 min-[320px]:text-xs max-[450px]:text-xs min-[320px]:mt-1 max-[450px]:mt-1">
//             {item.price[0].price} {item.price[0].currency.toUpperCase()}
//           </p>
//         </div>
//       </Link>
//     )
//   })
// }
