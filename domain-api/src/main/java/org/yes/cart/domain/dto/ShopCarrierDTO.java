/*
 * Copyright 2009 Inspire-Software.com
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

package org.yes.cart.domain.dto;

import org.yes.cart.domain.entity.Identifiable;

/**
 * User: denispavlov
 * Date: 20/01/2020
 * Time: 08:24
 */
public interface ShopCarrierDTO extends Identifiable, AuditInfoDTO {

    /**
     * @return primary key
     */
    long getShopCarrierId();

    /**
     * Set primary key.
     *
     * @param shopCarrierId primary key value.
     */
    void setShopCarrierId(long shopCarrierId);

    /**
     * @return shop id
     */
    long getShopId();

    /**
     * @param shopId shop id
     */
    void setShopId(long shopId);

    /**
     * @return carrier id
     */
    long getCarrierId();

    /**
     * Set carrier id.
     *
     * @param carrierId carrier id
     */
    void setCarrierId(long carrierId);

    /**
     * Disable this carrier in shop.
     *
     * @return true if this is disabled
     */
    boolean isDisabled();

    /**
     * Disable this carrier in shop.
     *
     * @param disabled true if this is disabled
     */
    void setDisabled(boolean disabled);


}
