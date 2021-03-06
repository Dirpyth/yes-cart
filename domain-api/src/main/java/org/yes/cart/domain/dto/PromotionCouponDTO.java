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
 * Date: 13-10-22
 * Time: 5:33 PM
 */
public interface PromotionCouponDTO extends Identifiable, AuditInfoDTO {


    /**
     * @return coupon PK
     */
    long getPromotioncouponId();

    /**
     * @param promotioncouponId coupon PK
     */
    void setPromotioncouponId(long promotioncouponId);


    /**
     * @return promotion PK
     */
    long getPromotionId();

    /**
     * @param promotionId promotion PK
     */
    void setPromotionId(long promotionId);

    /**
     * Get the promotion code.
     *
     * @return promotion code.
     */
    String getCode();

    /**
     * Promotion code.
     *
     * @param code promotion code
     */
    void setCode(String code);



    /**
     * @return overall usage limit
     */
    int getUsageLimit();

    /**
     * @param usageLimit overall usage limit
     */
    void setUsageLimit(int usageLimit);

    /**
     * @return usage limit for single customer
     */
    int getUsageLimitPerCustomer();

    /**
     * @param usageLimit usage limit for single customer
     */
    void setUsageLimitPerCustomer(int usageLimit);

    /**
     * @return number of times this coupon had been used.
     */
    int getUsageCount();

    /**
     * @param usageCount number of times this coupon had been used.
     */
    void setUsageCount(int usageCount);

}
