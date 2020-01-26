/*
 * Copyright 2009 Denys Pavlov, Igor Azarnyi
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package org.yes.cart.domain.dto.impl;

import com.inspiresoftware.lib.dto.geda.annotations.Dto;
import com.inspiresoftware.lib.dto.geda.annotations.DtoField;
import org.yes.cart.domain.dto.ShopCarrierDTO;

/**
 * User: denispavlov
 * Date: 20/01/2020
 * Time: 08:26
 */
@Dto
public class ShopCarrierDTOImpl implements ShopCarrierDTO {

    private static final long serialVersionUID = 2010717L;

    @DtoField(value = "carrierShopId", readOnly = true)
    private long shopCarrierId;

    @DtoField(value = "shop.shopId", readOnly = true)
    private long shopId;

    @DtoField(value = "carrier.carrierId", readOnly = true)
    private long carrierId;

    @DtoField(value = "disabled")
    private boolean disabled;

    /** {@inheritDoc} */
    @Override
    public long getShopCarrierId() {
        return shopCarrierId;
    }

    /** {@inheritDoc}*/
    @Override
    public long getId() {
        return shopCarrierId;
    }

    /** {@inheritDoc} */
    @Override
    public void setShopCarrierId(final long shopCarrierId) {
        this.shopCarrierId = shopCarrierId;
    }

    /** {@inheritDoc} */
    @Override
    public long getShopId() {
        return shopId;
    }

    /** {@inheritDoc} */
    @Override
    public void setShopId(final long shopId) {
        this.shopId = shopId;
    }

    /** {@inheritDoc} */
    @Override
    public long getCarrierId() {
        return carrierId;
    }

    /** {@inheritDoc} */
    @Override
    public void setCarrierId(final long carrierId) {
        this.carrierId = carrierId;
    }

    /** {@inheritDoc} */
    @Override
    public boolean isDisabled() {
        return disabled;
    }

    /** {@inheritDoc} */
    @Override
    public void setDisabled(final boolean disabled) {
        this.disabled = disabled;
    }

    @Override
    public String toString() {
        return "ShopCarrierDTOImpl{" +
                "shopCarrierId=" + shopCarrierId +
                ", shopId=" + shopId +
                ", carrierId=" + carrierId +
                ", disabled=" + disabled +
                '}';
    }}
