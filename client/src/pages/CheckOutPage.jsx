import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/Input/Input";
import Label from "../components/Label/Label";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { convertCurr } from "../../utils/convertCurr";
import { Loading } from "../components";
import { Dropdown } from "../components/dropdown";

const categoriesData = ["Thanh toán khi nhận hàng", "Thanh toán trực tuyến qua VNPAY"];

const CheckOutPage = () => {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getDropdownLabel = (name, defaultValue = "") => {
    const value = watch(name) || defaultValue;
    return value;
  };

  const handleSelectDropdownOption = (name, value) => {
    setValue(name, value);
  };

  useEffect(() => {
    const arrErroes = Object.values(errors);
    if (arrErroes.length > 0) {
      toast.error(arrErroes[0]?.message, {
        pauseOnHover: false,
        delay: 0,
      });
    }
  }, [errors]);

  useEffect(() => {
    setLoading(true);
    fetch("https://api-ebook.cyclic.app/api/carts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      withCredentials: true,
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total_price);
        setLoading(false);
      });
  }, []);

  // random ra chuỗi 6 kí tự để tạo mã đơn hàng
  const randomString = () => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  return (
    <div className="bg-white">
      <div className="container">
        <div className="flex items-center justify-between py-5">
          <div className="text-2xl font-bold text-text1">Thanh toán</div>
          <div className="text-text3">Trang chủ / Thanh toán</div>
        </div>
        {loading ? (
          <div className="w-full h-[60vh] flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <div className="flex">
            <div className="w-1/2">
              <h2 className="">Thông tin giao hàng</h2>
              <form action="">
                <div className="my-3 flex flex-col gap-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Họ và tên"
                    control={control}></Input>
                </div>
                <div className="my-3 flex flex-col gap-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="Số điện thoại"
                    control={control}></Input>
                </div>
                <div className="my-3 flex flex-col gap-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Địa chỉ"
                    control={control}></Input>
                </div>
                <div className="my-3 flex flex-col gap-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Email"
                    control={control}></Input>
                </div>
                <div className="my-3 flex flex-col gap-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Input
                    type="text"
                    name="note"
                    id="note"
                    placeholder="Ghi chú"
                    control={control}></Input>
                </div>
                <div className="my-3 flex flex-col gap-y-2">
                  <Label htmlFor="payment">Phương thức thanh toán</Label>
                  <Dropdown>
                    <Dropdown.Select
                      placeholder={getDropdownLabel(
                        "category",
                        "Lựa chọn phương thức thanh toán"
                      )}></Dropdown.Select>
                    <Dropdown.List classNames="bg-whiteSoft">
                      {categoriesData.map((category) => (
                        <Dropdown.Option
                          key={category}
                          onClick={() =>
                            handleSelectDropdownOption("category", category)
                          }>
                          <span className="capitalize">{category}</span>
                        </Dropdown.Option>
                      ))}
                    </Dropdown.List>
                  </Dropdown>
                </div>
                <div className="my-3 flex flex-col gap-y-2">
                  {/* mã chuyển khoản */}
                  <Label htmlFor="payment">Mã chuyển khoản</Label>
                  <p className="">
                    Chuyển khoản với nội dung: EBOOK - {randomString()}
                  </p>
                </div>
                <div className="">
                  <button
                    type="submit"
                    className="w-full py-4 mt-4 text-lg font-bold text-white transition-all duration-200 ease-linear bg-primary rounded-lg shadow outline-none hover:shadow-lg focus:outline-none">
                    Đặt hàng
                  </button>
                </div>
              </form>
            </div>
            <div className="w-1/2 px-5">
              <h2 className="">Thông tin đơn hàng</h2>
              {products &&
                products.map((item) => (
                  <div
                    className="flex items-center justify-between border-b border-dashed py-2"
                    key={item._id}>
                    <div className="flex items-center gap-5">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <p className="text-text2 font-medium max-w-[300px]">
                        {item.product.name}
                      </p>
                    </div>
                    <p className="">
                      {convertCurr(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              <div className="">
                <div className="flex items-center justify-between py-2">
                  <p className="text-text2 font-medium">Tạm tính</p>
                  <p className="text-text2 font-medium">{convertCurr(total)}</p>
                </div>
                <div className="flex items-center justify-between border-b border-dashed py-2">
                  <p className="text-text2 font-medium">Phí vận chuyển</p>
                  <p className="text-text2 font-medium">0₫</p>
                </div>
                <div className="flex items-center justify-between border-b border-dashed py-2">
                  <p className="text-text2 font-medium">Tổng cộng</p>
                  <p className="text-text2 font-medium">{convertCurr(total)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOutPage;
