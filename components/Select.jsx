"use client";
import { ChevronDownIcon } from "@nextui-org/shared-icons";

export default function Select({ options, label, onSelect, ...props }) {
    return (
        <div className="relative w-full">
            <ChevronDownIcon className="absolute right-3 top-0 translate-y-full mt-2 text-foreground-500" />
            <select
                {...props}
                onChange={(e) => onSelect("categoryId", e.target.value)}
                className={`w-full h-[3.4rem] px-3 text-foreground-500 text-sm outline-none rounded-medium border-medium focus:ring-0 border appearance-none border-default-200`}
            >
                <option
                    value=""
                    className="text-foreground-500 "
                    disabled
                    hidden
                    selected
                >
                    {label}
                </option>
                {options &&
                    options.map((option, index) => {
                        return (
                            <option
                                className="text-foreground-500 "
                                key={index}
                                value={option._id}
                            >
                                {option.title}
                            </option>
                        );
                    })}
            </select>
        </div>
    );
}
